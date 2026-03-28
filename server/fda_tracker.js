const { Groq } = require("groq-sdk");
const https = require("https");

// ── Shared helpers ─────────────────────────────────────────────────────────
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`FDA JSON parse failed: ${e.message}`));
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchOngoingFoodRecalls(limit = 100) {
  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 100));
  const url = `https://api.fda.gov/food/enforcement.json?search=status:%22Ongoing%22+AND+product_type:%22Food%22&limit=${safeLimit}`;
  const data = await fetchJson(url);
  return data?.results || [];
}

function dot(a, b) {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}
function norm(v) {
  return Math.sqrt(dot(v, v)) || 1e-12;
}
function cosine(a, b) {
  return dot(a, b) / (norm(a) * norm(b));
}
function clean(s = "") {
  return String(s).replace(/\s+/g, " ").trim();
}
function pantryText(item) {
  const name = item.common_name || item.name || "";
  const brand = item.brand || "";
  return clean(`${brand} ${name}`);
}
function recallText(r) {
  return clean(
    [r.product_description, r.reason_for_recall, r.code_info, r.recalling_firm]
      .filter(Boolean)
      .join(" | ")
  );
}

// ── Semantic matching (HF embeddings) ─────────────────────────────────────
async function embedBatch(inputs) {
  const resp = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
      },
      body: JSON.stringify({ inputs }),
    }
  );
  const text = await resp.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error(`HF embeddings failed: ${data?.error || JSON.stringify(data)}`);
  }

  return data;
}

async function matchPantryToFDASemantic(pantryItems = [], opts = {}) {
  const { limit = 100, minCosine = 0.62, topKPerItem = 3 } = opts;

  const recalls = await fetchOngoingFoodRecalls(limit);

  const pantryPayload = pantryItems
    .map((p) => ({ raw: p, text: pantryText(p) }))
    .filter((x) => x.text.length > 0);

  const recallPayload = recalls
    .map((r) => ({ raw: r, text: recallText(r) }))
    .filter((x) => x.text.length > 0);

  if (!pantryPayload.length || !recallPayload.length) return [];

  const pantryEmb = await embedBatch(pantryPayload.map((x) => x.text));
  const recallEmb = await embedBatch(recallPayload.map((x) => x.text));

  const matches = [];

  for (let i = 0; i < pantryPayload.length; i++) {
    const p = pantryPayload[i];
    const pVec = pantryEmb[i];

    const scored = recallPayload.map((r, j) => ({
      recall: r.raw,
      score: cosine(pVec, recallEmb[j]),
    }));

    const top = scored
      .filter((x) => x.score >= minCosine)
      .sort((a, b) => b.score - a.score)
      .slice(0, topKPerItem);

    for (const t of top) {
      matches.push({
        pantry_item: {
          name: p.raw.common_name || p.raw.name || "",
          brand: p.raw.brand || "",
        },
        recall: {
          event_id: t.recall.event_id,
          recall_number: t.recall.recall_number,
          classification: t.recall.classification,
          status: t.recall.status,
          recalling_firm: t.recall.recalling_firm,
          product_description: t.recall.product_description,
          reason_for_recall: t.recall.reason_for_recall,
          recall_initiation_date: t.recall.recall_initiation_date,
          center_classification_date: t.recall.center_classification_date,
        },
        cosine_similarity: Number(t.score.toFixed(4)),
      });
    }
  }

  return matches.sort((a, b) => b.cosine_similarity - a.cosine_similarity);
}

// ── Recall summarization (cached) ──────────────────────────────────────────
const recallSummaryCache = new Map(); // key -> { summary, ts }
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function fallbackSummary(r) {
  const reason = (r.reason_for_recall || "Potential safety issue").trim();
  return `${reason}. Check lot/code details and do not consume if your product matches.`;
}

async function summarizeRecallWithGroq(groq, recall) {
  const cacheKey = `${recall.event_id || ""}:${recall.report_date || ""}:${recall.recall_number || ""}`;
  const now = Date.now();
  const cached = recallSummaryCache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) return cached.summary;

  const prompt = `
Summarize this FDA food recall for consumers in 1-2 short plain-English sentences.
Include:
1) what the issue is
2) what action to take
No markdown.

Product: ${recall.product_description || "Unknown"}
Reason: ${recall.reason_for_recall || "Unknown"}
Classification: ${recall.classification || "Unknown"}
Recall number: ${recall.recall_number || "Unknown"}
Code info: ${recall.code_info || "N/A"}
`.trim();

  try {
    const resp = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
      max_tokens: 120,
      messages: [{ role: "user", content: prompt }],
    });

    const summary = (resp.choices?.[0]?.message?.content || "").trim() || fallbackSummary(recall);
    recallSummaryCache.set(cacheKey, { summary, ts: now });
    return summary;
  } catch {
    const summary = fallbackSummary(recall);
    recallSummaryCache.set(cacheKey, { summary, ts: now });
    return summary;
  }
}

async function fetchRecallsWithSummaries(opts = {}) {
  const { limit = 100, summarizeTopN = 20 } = opts;
  const recalls = await fetchOngoingFoodRecalls(limit);
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  for (let i = 0; i < recalls.length; i++) {
    recalls[i].human_summary =
      i < summarizeTopN ? await summarizeRecallWithGroq(groq, recalls[i]) : fallbackSummary(recalls[i]);
  }

  return recalls;
}

module.exports = {
  fetchOngoingFoodRecalls,
  fetchRecallsWithSummaries,
  matchPantryToFDASemantic,
};
