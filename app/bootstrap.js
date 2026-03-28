document.addEventListener("DOMContentLoaded", async () => {
    window.renderPantry();
    window.updateRecalledCount();
    if (typeof window.updateAlertsBadge === "function") window.updateAlertsBadge();
    await loadRecallsOnStartup();
});

async function loadRecallsOnStartup() {
    const page = document.getElementById("page-recalls");
    if (!page) return;

    try {
        const res = await fetch("/recalls");
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Failed to load recalls");

        const recalls = json.data || [];

        page.querySelectorAll(".recall-card").forEach((n) => n.remove());

        const subtitle = page.querySelector(".page-subtitle");
        if (subtitle) subtitle.textContent = `Updated now · ${recalls.length} active`;

        for (const r of recalls) {
            const clsRaw = String(r.classification || "").toLowerCase();
            const sevClass = clsRaw.includes("class i") ? "sev-1" : clsRaw.includes("class ii") ? "sev-2" : "sev-3";
            const classBadge = clsRaw.includes("class i") ? "class-I" : clsRaw.includes("class ii") ? "class-II" : "class-III";

            const dateStr =
                r.report_date && String(r.report_date).length === 8
                ? `${r.report_date.slice(0, 4)}-${r.report_date.slice(4, 6)}-${r.report_date.slice(6, 8)}`
                : "N/A";

            const reasonText = r.human_summary || r.reason_for_recall || "No reason provided.";

            const card = document.createElement("div");
            card.className = "recall-card";
            card.onclick = function () {
                window.toggleRecall(this);
            };

            card.innerHTML = `
        <div class="recall-header">
          <div class="severity-dot ${sevClass}"></div>
          <div class="recall-title">${escapeHtml(r.product_description || "FDA Recall")}</div>
          <div class="recall-class ${classBadge}">${escapeHtml(r.classification || "Class ?")}</div>
        </div>
        <div class="recall-meta">FDA · <strong>${escapeHtml(dateStr)}</strong> · ${escapeHtml(r.recalling_firm || "Unknown firm")}</div>
        <div class="recall-tags">
          <span class="recall-tag-item">${escapeHtml(r.product_type || "Food")}</span>
          <span class="recall-tag-item">${escapeHtml(r.recall_number || r.event_id || "No ID")}</span>
        </div>
        <div class="recall-reason">${escapeHtml(reasonText)}</div>
      `;

            page.appendChild(card);
        }

        window.renderDashboardRecalls(recalls);
        window.renderDashboard();

    } catch (err) {
        console.error("loadRecallsOnStartup failed:", err);
        const card = document.createElement("div");
        card.className = "recall-card";
        card.innerHTML = `<div class="recall-meta">Failed to load recalls: ${escapeHtml(err.message || "unknown error")}</div>`;
        page.appendChild(card);
    }
}

function escapeHtml(v) {
    return String(v ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
