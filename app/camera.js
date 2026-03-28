// ── Camera / Scan flow ─────────────────────────────────────────────────────
const FOOD_EMOJI = {
    milk: "🥛", egg: "🥚", eggs: "🥚", butter: "🧈", cheese: "🧀", yogurt: "🫙",
    bread: "🍞", oat: "🌾", oats: "🌾", rice: "🍚", pasta: "🍝", flour: "🌾",
    chicken: "🍗", beef: "🥩", turkey: "🦃", pork: "🐷", salmon: "🐟", fish: "🐟",
    shrimp: "🍤", spinach: "🥬", broccoli: "🥦", carrot: "🥕", tomato: "🍅",
    potato: "🥔", onion: "🧅", garlic: "🧄", apple: "🍎", banana: "🍌",
    orange: "🍊", grape: "🍇", berry: "🫐", berries: "🫐", mango: "🥭",
    avocado: "🥑", lemon: "🍋", corn: "🌽", pepper: "🫑", mushroom: "🍄",
    coffee: "☕", tea: "🍵", juice: "🧃", water: "💧", soda: "🥤",
    oil: "🫙", sauce: "🫙", soup: "🥣", bean: "🫘", beans: "🫘",
    nut: "🥜", nuts: "🥜", peanut: "🥜", almond: "🌰", chocolate: "🍫",
    cookie: "🍪", cake: "🎂", ice: "🍦", frozen: "🧊", snack: "🍿",
};

function getFoodEmoji(name) {
    const lower = String(name || "").toLowerCase();
    for (const [key, emoji] of Object.entries(FOOD_EMOJI)) {
        if (lower.includes(key)) return emoji;
    }
    return "🛒";
}

function toTitleCase(str) {
    return String(str || "")
        .toLowerCase()
        .replace(/\b([a-z])/g, (m) => m.toUpperCase())
        .replace(/\s+/g, " ")
        .trim();
}

function addScannedItemsToPantry(data) {
    const foods = data?.foods || [];
    if (!foods.length) return;

    const now = new Date();
    const newItems = foods.map((f, idx) => {
        const days = Number(f.shelf_life_days) || 7;
        const exp = new Date(now.getTime() + days * 86400000);

        const addedStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const expStr = exp.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const commonName = toTitleCase(f.common_name || "Unknown item");

        return {
            id: `scan-${Date.now()}-${idx}`,
            cat: "safe",
            emoji: f.emoji || getFoodEmoji(commonName),
            name: commonName,
            meta: `Added ${addedStr} · Exp ${expStr}`,
            tag: "SAFE",
            tagClass: "tag-ok",
            itemClass: "",
            detail: {
                statusType: "safe",
                statusTitle: "✓ Added from receipt",
                statusDesc: `Imported from ${data.store_name || "receipt scan"}.`,
                why: `${f.brand || "Unknown brand"} · Estimated shelf life: ${days} day${days !== 1 ? "s" : ""}.`,
                flags: [
                    { label: `Brand: ${f.brand || "Unknown"}`, type: "neutral" },
                    { label: `Shelf life: ${days}d`, type: "ok" },
                    { label: "Scanned receipt", type: "ok" },
                ],
            },
        };
    });

    window.PANTRY = [...newItems, ...window.PANTRY];
}

window.showResults = function showResults(data) {
    const foods = data.foods || [];
    const matches = data.fda_semantic_matches || [];

    const bestByName = new Map();
    for (const m of matches) {
        const key = toTitleCase(m?.pantry_item?.name || "").toLowerCase();
        if (!key) continue;
        const prev = bestByName.get(key);
        if (!prev || (m.cosine_similarity || 0) > (prev.cosine_similarity || 0)) bestByName.set(key, m);
    }

    document.getElementById("results-store").textContent =
        `${foods.length} item${foods.length !== 1 ? "s" : ""} from ${data.store_name || "your receipt"}`;

    const list = document.getElementById("results-list");
    list.innerHTML = foods
        .map((f) => {
            const commonName = toTitleCase(f.common_name || "Unknown item");
            const expiry = new Date(Date.now() + (Number(f.shelf_life_days) || 7) * 86400000);
            const expiryStr = expiry.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const key = commonName.toLowerCase();
            const hit = bestByName.get(key);

            return `<div class="result-item ${hit ? "result-item-recalled" : ""}">
      <div class="result-emoji">${f.emoji || getFoodEmoji(commonName)}</div>
      <div class="result-info">
        <div class="result-name">${commonName}</div>
        <div class="result-meta">${f.brand || ""}</div>
        <div class="result-expiry">Expires ~${expiryStr}</div>
        ${hit ? `<div class="result-recall-pill">⚠ FDA match ${hit.recall?.recall_number || ""} · sim ${hit.cosine_similarity}</div>` : ``}
      </div>
    </div>`;
        })
        .join("");

    document.getElementById("results-modal").classList.add("open");
};

window.closeResultsModal = function closeResultsModal(e) {
    if (!e || e.target === document.getElementById("results-modal")) {
        document.getElementById("results-modal").classList.remove("open");
        window.switchTab("pantry");
    }
};

window.triggerCamera = function triggerCamera() {
    const input = document.getElementById("camera-input");
    if (!input) return;
    input.value = "";
    input.click();
};

const cameraInput = document.getElementById("camera-input");
if (cameraInput) {
    cameraInput.addEventListener("change", async function () {
        const file = this.files?.[0];
        if (!file) return;
        this.value = "";

        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        window.showProcessing("Reading receipt…", "Extracting line items from your photo…", 20);

        try {
            setTimeout(() => window.setProcessingStep("Identifying products…", "Matching SKUs to real food names…", 55), 1200);
            setTimeout(() => window.setProcessingStep("Checking recalls…", "Cross-referencing FDA database…", 80), 2600);

            const res = await fetch("/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64 }),
            });

            const json = await res.json();
            if (!json.ok) throw new Error(json.error || "Server error");

            addScannedItemsToPantry(json.data);
            applyFDAMatchesToPantry(json.data);
            addFDAMatchesToAlerts(json.data);
            window.updateAlertsBadge();
            window.renderPantry("all");
            window.updateRecalledCount();
            window.renderDashboard();

            window.setProcessingStep("Done!", "Items added to your pantry", 100);

            setTimeout(() => {
                window.hideProcessing();
                window.showResults(json.data);
            }, 500);
        } catch (err) {
            window.setProcessingStep("⚠️ Something went wrong", err.message || "Upload failed", 0);
            setTimeout(window.hideProcessing, 2200);
            console.error(err);
        }
    });
}

function applyFDAMatchesToPantry(data) {
    const matches = data?.fda_semantic_matches || [];
    if (!matches.length) return;

    const bestByName = new Map();
    for (const m of matches) {
        const key = toTitleCase(m?.pantry_item?.name || "").toLowerCase();
        if (!key) continue;
        const prev = bestByName.get(key);
        if (!prev || (m.cosine_similarity || 0) > (prev.cosine_similarity || 0)) bestByName.set(key, m);
    }

    window.PANTRY = window.PANTRY.map((item) => {
        const key = toTitleCase(item.name || "").toLowerCase();
        const hit = bestByName.get(key);
        if (!hit) return item;

        return {
            ...item,
            cat: "recalled",
            tag: "RECALLED",
            tagClass: "tag-recalled",
            itemClass: "recalled",
            alertId: item.alertId || "",
            detail: {
                statusType: "recalled",
                statusTitle: "⚠ POSSIBLE FDA MATCH",
                statusDesc: `Possible match (cosine ${hit.cosine_similarity}) to FDA recall ${hit.recall?.recall_number || ""}.`,
                why: `${hit.recall?.product_description || "FDA ongoing recall item"}\n\nReason: ${hit.recall?.reason_for_recall || "N/A"}`,
                flags: [
                    { label: hit.recall?.classification || "Recall", type: "bad" },
                    { label: `Similarity ${hit.cosine_similarity}`, type: "warn" },
                    { label: "Review lot/code info", type: "neutral" },
                ],
            },
        };
    });
}

function addFDAMatchesToAlerts(data) {
    const matches = data?.fda_semantic_matches || [];
    if (!matches.length) return;

    const alertsPage = document.getElementById("page-alerts");
    if (!alertsPage) return;

    const header = alertsPage.querySelector(".page-header");
    const seen = new Set();

    for (const m of matches) {
        const recallNum = m?.recall?.recall_number || m?.recall?.event_id || "unknown";
        const itemName = toTitleCase(m?.pantry_item?.name || "Pantry item");
        const key = `${recallNum}::${itemName}`.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        const domId = `alert-fda-${String(recallNum).replace(/[^a-zA-Z0-9_-]/g, "")}-${String(itemName).replace(/[^a-zA-Z0-9_-]/g, "")}`;
        if (document.getElementById(domId)) continue;

        const classification = (m?.recall?.classification || "").toLowerCase();
        const levelClass = classification.includes("class i")
            ? "critical"
            : classification.includes("class ii")
                ? "high"
                : classification.includes("class iii")
                    ? "medium"
                    : "high";

        const levelText = levelClass === "critical" ? "Critical" : levelClass === "high" ? "High" : levelClass === "medium" ? "Medium" : "Info";

        const card = document.createElement("div");
        card.className = `alert-card ${levelClass}`;
        card.id = domId;

        const reason = m?.recall?.reason_for_recall || "Possible FDA recall match.";
        const sim = m?.cosine_similarity ?? "N/A";
        const recallNo = m?.recall?.recall_number || "FDA Recall";
        const firm = m?.recall?.recalling_firm || "Unknown firm";

        card.innerHTML = `
      <div class="unread-dot"></div>
      <div class="alert-icon-wrap">🚨</div>
      <div class="alert-body">
        <div class="alert-top">
          <span class="alert-level level-${levelClass}">${levelText}</span>
          <span class="alert-time">now</span>
        </div>
        <div class="alert-title">${itemName} — ${recallNo}</div>
        <div class="alert-desc">${firm}. ${reason} (similarity: ${sim})</div>
      </div>
    `;

        if (header && header.nextSibling) alertsPage.insertBefore(card, header.nextSibling);
        else alertsPage.appendChild(card);
    }

    window.updateAlertsBadge();
}

window.updateAlertsBadge = function updateAlertsBadge() {
    const badge = document.getElementById("alerts-badge");
    if (!badge) return;
    const count = document.querySelectorAll("#page-alerts .alert-card").length;
    badge.textContent = String(count);
    badge.style.display = count > 0 ? "" : "none";
};

window.updateAlertsBadge();
