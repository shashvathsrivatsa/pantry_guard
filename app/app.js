// ── Pantry data ────────────────────────────────────────────────────────────
let PANTRY = [
  {
    id:'boarshead', cat:'recalled', emoji:'🥩', name:"Boar's Head Turkey Breast", meta:'Added Jun 12 · Exp Jun 20',
    tag:'RECALLED', tagClass:'tag-recalled', itemClass:'recalled',
    alertId:'alert-boarshead',
    detail:{
      statusType:'recalled',
      statusTitle:'⚠ ACTIVE FDA RECALL',
      statusDesc:"This product matches FDA recall #2024-0612 (Listeria monocytogenes). Do not consume — dispose of immediately or return to store for a full refund.",
      why:"Boar's Head deli products produced at the Jarratt, VA facility have tested positive for Listeria monocytogenes. Listeria is a serious infection risk — particularly dangerous for pregnant women, elderly, and immunocompromised individuals. The CDC has linked this outbreak to multiple hospitalizations.",
      flags:[
        {label:'Class I Recall', type:'bad'},
        {label:'Listeria monocytogenes', type:'bad'},
        {label:'EST. 12612 label', type:'warn'},
        {label:'Dispose immediately', type:'bad'}
      ]
    }
  },
  {
    id:'milk', cat:'recalled', emoji:'🥛', name:'Whole Milk 1 Gallon', meta:'Added Jun 14 · Exp Jun 25',
    tag:'RECALLED', tagClass:'tag-recalled', itemClass:'recalled',
    alertId:'alert-boarshead',
    detail:{
      statusType:'recalled',
      statusTitle:'⚠ ACTIVE FDA RECALL',
      statusDesc:"This lot matches an active FDA dairy recall. Do not consume. Return to point of purchase for a full refund.",
      why:"Contamination detected during routine FDA testing at the bottling facility. Lot codes affected: 2406A–2406D. The contamination involves undeclared allergen cross-contact during production line changeover.",
      flags:[
        {label:'Class II Recall', type:'bad'},
        {label:'Allergen cross-contact', type:'bad'},
        {label:'Lot 2406A-D affected', type:'warn'}
      ]
    }
  },
  {
    id:'corn', cat:'watch', emoji:'🌽', name:'Green Giant Corn Niblets', meta:'Added Jun 10 · Canned',
    tag:'WATCH', tagClass:'tag-warning', itemClass:'warning',
    alertId:'alert-corn',
    detail:{
      statusType:'watch',
      statusTitle:'👁 FDA MONITORING',
      statusDesc:"Not recalled, but under active FDA monitoring. Check your can's manufacturing date — cans pre-2022 may use BPA linings.",
      why:"Older Green Giant canned products were produced with BPA (bisphenol A) lined cans. BPA is an endocrine disruptor that can leach into food, especially acidic or fatty content. FDA has been phasing out BPA in food packaging. Products manufactured after 2022 use BPA-free linings — check the bottom of the can for the date code.",
      flags:[
        {label:'BPA lining concern', type:'warn'},
        {label:'FDA monitoring', type:'warn'},
        {label:'Not a recall', type:'neutral'},
        {label:'Check date code', type:'neutral'}
      ]
    }
  },
  {
    id:'jif', cat:'watch', emoji:'🥜', name:'Jif Peanut Butter', meta:'Added May 30 · Exp Dec 2024',
    tag:'WATCH', tagClass:'tag-watch', itemClass:'warning',
    alertId:'alert-jif',
    detail:{
      statusType:'watch',
      statusTitle:'👁 SUPPLY CHAIN FLAG',
      statusDesc:"Flagged in an FDA monitoring report for Salmonella traces detected upstream in the supply chain. Not yet a formal recall.",
      why:"FDA's routine surveillance identified Salmonella contamination at a peanut processing supplier used by Jif. The risk is low for most lots currently in circulation but the FDA has issued a watch advisory. Jif has had previous Class I Salmonella recalls (2022), making this an elevated monitoring priority.",
      flags:[
        {label:'Salmonella supply flag', type:'warn'},
        {label:'FDA watch advisory', type:'warn'},
        {label:'Prior 2022 recall history', type:'bad'},
        {label:'Check lot code', type:'neutral'}
      ]
    }
  },
  {
    id:'eggs', cat:'safe', emoji:'🥚', name:'Large Eggs · 1 Dozen', meta:'Added Jun 13 · Exp Jun 27',
    tag:'SAFE', tagClass:'tag-ok', itemClass:'',
    detail:{
      statusType:'safe',
      statusTitle:'✓ SAFE & HEALTHY',
      statusDesc:"No recalls or FDA flags. Eggs are one of the most nutritionally complete foods available.",
      why:"Eggs contain complete protein (all 9 essential amino acids), choline critical for brain health, and fat-soluble vitamins A, D, E, and K2. The FDA's most recent dietary guidelines have largely cleared eggs on dietary cholesterol concerns for healthy adults. No active recalls or monitoring notices for this product.",
      flags:[
        {label:'Complete protein', type:'ok'},
        {label:'High choline', type:'ok'},
        {label:'Vitamins A, D, E, K2', type:'ok'},
        {label:'No recalls', type:'ok'}
      ]
    }
  },
  {
    id:'oats', cat:'safe', emoji:'🫙', name:'Quaker Old Fashioned Oats', meta:'Added Jun 8 · Exp Jan 2025',
    tag:'SAFE', tagClass:'tag-ok', itemClass:'',
    detail:{
      statusType:'safe',
      statusTitle:'✓ SAFE & NUTRITIOUS',
      statusDesc:"No recalls or concerns. Quaker Oats carries an FDA-approved heart health claim — one of very few foods with that distinction.",
      why:"Oatmeal's soluble fiber (beta-glucan) has an FDA-approved health claim for reducing heart disease risk. Minimally processed, low glycemic index, and one of the best plant sources of protein. No artificial additives, preservatives, or FDA flags. A genuinely excellent pantry staple.",
      flags:[
        {label:'FDA heart health claim', type:'ok'},
        {label:'Beta-glucan fiber', type:'ok'},
        {label:'Whole grain', type:'ok'},
        {label:'Zero sodium', type:'ok'}
      ]
    }
  },
  {
    id:'spinach', cat:'safe', emoji:'🥬', name:'Baby Spinach 5oz', meta:'Added Jun 13 · Expires Jun 18 ⚠',
    tag:'SAFE', tagClass:'tag-ok', itemClass:'',
    detail:{
      statusType:'safe',
      statusTitle:'✓ SAFE — USE SOON',
      statusDesc:"No FDA flags or recalls. Nutrient-dense and clean. Note: expires in 3 days — use or freeze soon.",
      why:"Spinach is among the most nutrient-dense vegetables per calorie. Rich in vitamin K, folate, iron, and antioxidants including lutein and zeaxanthin linked to eye health. FDA includes spinach in its 'powerhouse' produce list. No active recalls — the FSMA traceability rule now tracks all leafy greens, making contamination detection much faster.",
      flags:[
        {label:'No recalls', type:'ok'},
        {label:'Vitamin K + Folate', type:'ok'},
        {label:'Antioxidant-rich', type:'ok'},
        {label:'Expires Jun 18', type:'warn'}
      ]
    }
  },
  {
    id:'bread', cat:'safe', emoji:'🍞', name:"Dave's Killer Bread", meta:'Added Jun 11 · Exp Jun 21',
    tag:'SAFE', tagClass:'tag-ok', itemClass:'',
    detail:{
      statusType:'safe',
      statusTitle:'✓ SAFE & HIGH QUALITY',
      statusDesc:"No FDA flags. One of the highest-rated whole grain breads for fiber and protein content.",
      why:"Dave's Killer Bread uses 21 whole grains and seeds, no high-fructose corn syrup, and no artificial preservatives. 5g of fiber and 5g of protein per slice — well above average for commercial bread. USDA organic certified. No recalls or FDA concerns on record.",
      flags:[
        {label:'21 whole grains', type:'ok'},
        {label:'No HFCS', type:'ok'},
        {label:'USDA Organic', type:'ok'},
        {label:'No artificial preservatives', type:'ok'}
      ]
    }
  }
];

// ── Render pantry list ─────────────────────────────────────────────────────
function renderPantry(filter='all'){
  const list = document.getElementById('pantry-list');
  list.innerHTML='';
  const items = filter==='all' ? PANTRY : PANTRY.filter(i=>i.cat===filter);
  items.forEach(item=>{
    const wrapper=document.createElement('div');
    wrapper.className='swipe-wrapper';
    wrapper.dataset.id=item.id;

    wrapper.innerHTML=`
      <div class="delete-bg"></div>
      <div class="pantry-item ${item.itemClass}" data-id="${item.id}">
        <div class="pantry-icon">${item.emoji}</div>
        <div class="pantry-info">
          <div class="pantry-name">${item.name}</div>
          <div class="pantry-meta">${item.meta}</div>
        </div>
        <span class="recall-tag ${item.tagClass}">${item.tag}</span>
      </div>`;

    list.appendChild(wrapper);
    initSwipe(wrapper, item);
  });
}

renderPantry();

// ── Swipe-to-delete ────────────────────────────────────────────────────────
function initSwipe(wrapper, item){
  const row = wrapper.querySelector('.pantry-item');
  let startX=0, currentX=0, isDragging=false, isClick=false;
  const THRESHOLD = 80; // px to trigger delete

  function onStart(e){
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    isDragging=true; isClick=true;
    row.style.transition='none';
  }
  function onMove(e){
    if(!isDragging) return;
    currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    if(Math.abs(currentX) > 6) isClick=false;
    if(currentX > 0) currentX=0; // only left swipe
    row.style.transform=`translateX(${currentX}px)`;
    wrapper.querySelector('.delete-bg').style.opacity = Math.min(Math.abs(currentX)/THRESHOLD, 1);
  }
  function onEnd(){
    if(!isDragging) return;
    isDragging=false;
    row.style.transition='transform .25s cubic-bezier(.16,1,.3,1), opacity .25s';
    if(Math.abs(currentX) >= THRESHOLD){
      deleteItem(wrapper, item);
    } else {
      row.style.transform='translateX(0)';
      wrapper.querySelector('.delete-bg').style.opacity=0;
      if(isClick) openItemDetail(item);
    }
    currentX=0;
  }

  row.addEventListener('touchstart', onStart, {passive:true});
  row.addEventListener('touchmove', onMove, {passive:true});
  row.addEventListener('touchend', onEnd);
  row.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', e=>{ if(isDragging) onMove(e); });
  window.addEventListener('mouseup', ()=>{ if(isDragging) onEnd(); });
}

function deleteItem(wrapper, item){
  const row = wrapper.querySelector('.pantry-item');
  row.classList.add('removing');
  setTimeout(()=>{
    wrapper.style.transition='max-height .3s ease, opacity .3s ease, margin .3s ease';
    wrapper.style.maxHeight = wrapper.offsetHeight+'px';
    requestAnimationFrame(()=>{
      wrapper.style.maxHeight='0';
      wrapper.style.opacity='0';
      wrapper.style.marginBottom='0';
    });
    setTimeout(()=>{ wrapper.remove(); updateRecalledCount(); }, 320);
  }, 260);
}

function updateRecalledCount(){
  const remaining = document.querySelectorAll('.pantry-item.recalled').length;
  const badge = document.getElementById('pantry-badge');
  badge.textContent = remaining;
  if(remaining===0) badge.style.display='none';
}

// ── Item detail sheet ──────────────────────────────────────────────────────
function openItemDetail(item){
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
      <div class="detail-label">Why ${ d.statusType==='safe' ? 'it\'s good' : d.statusType==='watch' ? 'it\'s flagged' : 'it\'s dangerous' }</div>
      <div class="detail-body">${d.why}</div>
    </div>
    <div class="detail-section">
      <div class="detail-label">Flags</div>
      <div class="detail-flags">${flagsHtml}</div>
    </div>
    ${ctaBtn}`;

  document.getElementById('detail-modal').classList.add('open');
}

function closeDetailModal(e){
  if(!e || e.target===document.getElementById('detail-modal')){
    document.getElementById('detail-modal').classList.remove('open');
  }
}

// ── Deep-link to alert ─────────────────────────────────────────────────────
function goToAlert(alertId){
  document.getElementById('detail-modal').classList.remove('open');
  setTimeout(()=>{
    switchTab('alerts');
    setTimeout(()=>{
      const el = document.getElementById(alertId);
      if(el){
        el.scrollIntoView({behavior:'smooth', block:'center'});
        el.classList.add('highlight');
        setTimeout(()=>el.classList.remove('highlight'), 1500);
      }
    }, 320);
  }, 200);
}

// ── Tab switching ──────────────────────────────────────────────────────────
function switchTab(tab){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+tab).classList.add('active');
  const nb=document.getElementById('nav-'+tab);
  if(nb) nb.classList.add('active');
  document.querySelector('.scroll-area').scrollTop=0;
}

// ── Pantry filter ──────────────────────────────────────────────────────────
function filterPantry(btn, cat){
  document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  renderPantry(cat);
}

// ── Recall expand ──────────────────────────────────────────────────────────
function toggleRecall(card){ card.classList.toggle('open'); }

// ── Scan modal ─────────────────────────────────────────────────────────────
function openScanModal(){ document.getElementById('scan-modal').classList.add('open'); }
function closeScanModal(e){
  if(!e || e.target===document.getElementById('scan-modal')){
    document.getElementById('scan-modal').classList.remove('open');
  }
}


// ── Camera / Scan flow ─────────────────────────────────────────────────────
const cameraInput = document.getElementById('camera-input');

if (cameraInput) {
  cameraInput.addEventListener('change', async function () {
    const file = this.files?.[0];
    if (!file) return;
    this.value = '';

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    showProcessing('Reading receipt…', 'Extracting line items from your photo…', 20);

    try {
      setTimeout(() => setProcessingStep('Identifying products…', 'Matching SKUs to real food names…', 55), 1200);
      setTimeout(() => setProcessingStep('Checking recalls…', 'Cross-referencing FDA database…', 80), 2600);

      const res = await fetch('/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Server error');

      addScannedItemsToPantry(json.data);
      renderPantry('all');
      updateRecalledCount();

      setProcessingStep('Done!', 'Items added to your pantry', 100);

        setTimeout(() => {
            hideProcessing();
            showResults(json.data);
        }, 500);
    } catch (err) {
        setProcessingStep('⚠️ Something went wrong', err.message || 'Upload failed', 0);
        setTimeout(hideProcessing, 2200);
        console.error(err);
    }
  });
}

document.getElementById('camera-input').addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;
    this.value = ''; // reset so same file can be picked again

    // Convert to base64
    const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    // Show processing overlay
    showProcessing('Reading receipt\u2026', 'Extracting line items from your photo\u2026', 20);

    try {
        console.log("Image captured, starting scan process");

        // Simulate step updates while server works
        setTimeout(() => setProcessingStep('Identifying products\u2026', 'Matching SKUs to real food names\u2026', 55), 2000);
        setTimeout(() => setProcessingStep('Checking recalls\u2026', 'Cross-referencing FDA database\u2026', 80), 4000);

        const res = await fetch('/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 })
        });

        const json = await res.json();

        if (!json.ok) throw new Error(json.error || 'Server error');

        addScannedItemsToPantry(json.data);
        renderPantry('all');
        updateRecalledCount();
        console.log('Scan result:', json.data);

        setProcessingStep('Done!', 'Items added to your pantry', 100);

        // Brief pause so "Done!" registers, then show results
        setTimeout(() => {
            hideProcessing();
            showResults(json.data);
        }, 700);

    } catch (err) {
        setProcessingStep('\u26a0\ufe0f Something went wrong', err.message, 0);
        setTimeout(hideProcessing, 2500);
    }
});

function showProcessing(title, sub, pct) {
    document.getElementById('processing-title').textContent = title;
    document.getElementById('processing-sub').textContent = sub;
    document.getElementById('processing-fill').style.width = pct + '%';
    document.getElementById('processing-modal').classList.add('open');
}

function setProcessingStep(title, sub, pct) {
    document.getElementById('processing-title').textContent = title;
    document.getElementById('processing-sub').textContent = sub;
    document.getElementById('processing-fill').style.width = pct + '%';
}

function hideProcessing() {
    document.getElementById('processing-modal').classList.remove('open');
    document.getElementById('processing-fill').style.width = '0%';
}

// Food emoji map — best-effort by common name
const FOOD_EMOJI = {
    milk:'🥛', egg:'🥚', eggs:'🥚', butter:'🧈', cheese:'🧀', yogurt:'🫙',
    bread:'🍞', oat:'🌾', oats:'🌾', rice:'🍚', pasta:'🍝', flour:'🌾',
    chicken:'🍗', beef:'🥩', turkey:'🦃', pork:'🐷', salmon:'🐟', fish:'🐟',
    shrimp:'🍤', spinach:'🥬', broccoli:'🥦', carrot:'🥕', tomato:'🍅',
    potato:'🥔', onion:'🧅', garlic:'🧄', apple:'🍎', banana:'🍌',
    orange:'🍊', grape:'🍇', berry:'🫐', berries:'🫐', mango:'🥭',
    avocado:'🥑', lemon:'🍋', corn:'🌽', pepper:'🫑', mushroom:'🍄',
    coffee:'☕', tea:'🍵', juice:'🧃', water:'💧', soda:'🥤',
    oil:'🫙', sauce:'🫙', soup:'🥣', bean:'🫘', beans:'🫘',
    nut:'🥜', nuts:'🥜', peanut:'🥜', almond:'🌰', chocolate:'🍫',
    cookie:'🍪', cake:'🎂', ice:'🍦', frozen:'🧊', snack:'🍿',
};

function getFoodEmoji(name) {
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(FOOD_EMOJI)) {
        if (lower.includes(key)) return emoji;
    }
    return '🛒';
}

function showResults(data) {
    const foods = data.foods || [];
    document.getElementById('results-store').textContent =
        `${foods.length} item${foods.length !== 1 ? 's' : ''} from ${data.store_name || 'your receipt'}`;

    const list = document.getElementById('results-list');
    list.innerHTML = foods.map(f => {
        const expiry = new Date(Date.now() + f.shelf_life_days * 86400000);
        const expiryStr = expiry.toLocaleDateString('en-US', { month:'short', day:'numeric' });
        return `<div class="result-item">
            <div class="result-emoji">${getFoodEmoji(f.common_name)}</div>
            <div class="result-info">
                <div class="result-name">${f.common_name}</div>
                <div class="result-meta">${f.brand}</div>
                <div class="result-expiry">Expires ~${expiryStr}</div>
            </div>
        </div>`;
    }).join('');

    document.getElementById('results-modal').classList.add('open');
}

function closeResultsModal(e) {
    if (!e || e.target === document.getElementById('results-modal')) {
        document.getElementById('results-modal').classList.remove('open');
        switchTab('pantry');
    }
}


const cameraInput = document.getElementById('camera-input');
if (cameraInput) {
    cameraInput.addEventListener('change', async function () {
        const file = this.files && this.files[0];
        if (!file) return;

        // reset so same file can be selected again next time
        this.value = '';

        // Convert to base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Show processing overlay
        showProcessing('Reading receipt…', 'Extracting line items from your photo…', 20);

        try {
            setTimeout(() => setProcessingStep('Identifying products…', 'Matching SKUs to real food names…', 55), 1200);
            setTimeout(() => setProcessingStep('Checking recalls…', 'Cross-referencing FDA database…', 80), 2600);

            const res = await fetch('/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
            });

            const json = await res.json();
            if (!json.ok) throw new Error(json.error || 'Server error');

            setProcessingStep('Done!', 'Items added to your pantry', 100);

            setTimeout(() => {
                hideProcessing();
                showResults(json.data);
            }, 500);
        } catch (err) {
            setProcessingStep('⚠️ Something went wrong', err.message || 'Upload failed', 0);
            setTimeout(hideProcessing, 2200);
        }
    });
}


function addScannedItemsToPantry(data) {
    const foods = data?.foods || [];
    if (!foods.length) return;

    const now = new Date();

    const newItems = foods.map((f, idx) => {
        const days = Number(f.shelf_life_days) || 7;
        const exp = new Date(now.getTime() + days * 86400000);

        const addedStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const expStr = exp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return {
            id: `scan-${Date.now()}-${idx}`,
            cat: 'safe',
            emoji: getFoodEmoji(f.common_name || 'item'),
            name: (f.common_name || 'Unknown item').trim(),
            meta: `Added ${addedStr} · Exp ${expStr}`,
            tag: 'SAFE',
            tagClass: 'tag-ok',
            itemClass: '',
            detail: {
                statusType: 'safe',
                statusTitle: '✓ Added from receipt',
                statusDesc: `Imported from ${data.store_name || 'receipt scan'}.`,
                why: `${f.brand || 'Unknown brand'} · Estimated shelf life: ${days} day${days !== 1 ? 's' : ''}.`,
                flags: [
                    { label: `Brand: ${f.brand || 'Unknown'}`, type: 'neutral' },
                    { label: `Shelf life: ${days}d`, type: 'ok' },
                    { label: 'Scanned receipt', type: 'ok' }
                ]
            }
        };
    });

    // add newest first
    PANTRY = [...newItems, ...PANTRY];
}
