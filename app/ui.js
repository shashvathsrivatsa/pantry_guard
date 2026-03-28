// ── Item detail sheet ──────────────────────────────────────────────────────
window.openItemDetail = function openItemDetail(item){
    const d = item.detail;
    const flagsHtml = d.flags.map(f=>`<span class="dflag ${f.type}">${f.label}</span>`).join('');

    const ctaBtn = (d.statusType==='recalled'||d.statusType==='watch') && item.alertId
        ? `<button class="btn-view-alert ${d.statusType}" onclick="goToAlert('${item.alertId}')">
        ${ d.statusType==='recalled' ? '🚨 View Recall Alert' : '👁 View Watch Advisory' }
       </button>`
        : '';

    document.getElementById('detail-content').innerHTML=`
    <span class="detail-emoji">${item.emoji}</span>
    <div class="detail-name">${item.name}</div>
    <div class="detail-meta">${item.meta}</div>
    <div class="detail-status-banner ${d.statusType}">
      <div class="dsb-icon">${d.statusType==='recalled'?'🚨':d.statusType==='watch'?'👁':'✅'}</div>
      <div class="dsb-text">
        <div class="dsb-title ${d.statusType}">${d.statusTitle}</div>
        <div class="dsb-desc">${d.statusDesc}</div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-label">Why ${ d.statusType==='safe' ? "it's good" : d.statusType==='watch' ? "it's flagged" : "it's dangerous" }</div>
      <div class="detail-body">${d.why}</div>
    </div>
    <div class="detail-section">
      <div class="detail-label">Flags</div>
      <div class="detail-flags">${flagsHtml}</div>
    </div>
    ${ctaBtn}`;

    document.getElementById('detail-modal').classList.add('open');
};

window.closeDetailModal = function closeDetailModal(e){
    if(!e || e.target===document.getElementById('detail-modal')){
        document.getElementById('detail-modal').classList.remove('open');
    }
};

// ── Deep-link to alert ─────────────────────────────────────────────────────
window.goToAlert = function goToAlert(alertId){
    document.getElementById('detail-modal').classList.remove('open');
    setTimeout(()=>{
        window.switchTab('alerts');
        setTimeout(()=>{
            const el = document.getElementById(alertId);
            if(el){
                el.scrollIntoView({behavior:'smooth', block:'center'});
                el.classList.add('highlight');
                setTimeout(()=>el.classList.remove('highlight'), 1500);
            }
        }, 320);
    }, 200);
};

// ── Tab switching ──────────────────────────────────────────────────────────
window.switchTab = function switchTab(tab){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('page-'+tab).classList.add('active');
    const nb = document.getElementById('nav-'+tab);
    if(nb) nb.classList.add('active');
    const scroller = document.querySelector('.scroll-area');
    if (scroller) scroller.scrollTop = 0;
};

// ── Recall expand ──────────────────────────────────────────────────────────
window.toggleRecall = function toggleRecall(card){ card.classList.toggle('open'); };

// ── Processing & Results modals ────────────────────────────────────────────
window.showProcessing = function showProcessing(title, sub, pct) {
    document.getElementById('processing-title').textContent = title;
    document.getElementById('processing-sub').textContent = sub;
    document.getElementById('processing-fill').style.width = pct + '%';
    document.getElementById('processing-modal').classList.add('open');
};

window.setProcessingStep = function setProcessingStep(title, sub, pct) {
    document.getElementById('processing-title').textContent = title;
    document.getElementById('processing-sub').textContent = sub;
    document.getElementById('processing-fill').style.width = pct + '%';
};

window.hideProcessing = function hideProcessing() {
    document.getElementById('processing-modal').classList.remove('open');
    document.getElementById('processing-fill').style.width = '0%';
};
