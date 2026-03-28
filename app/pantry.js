// ── Render pantry list ─────────────────────────────────────────────────────
window.renderPantry = function renderPantry(filter='all'){
    const list = document.getElementById('pantry-list');
    if (!list) return;
    list.innerHTML='';

    const items = filter==='all' ? window.PANTRY : window.PANTRY.filter(i=>i.cat===filter);

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
};

// ── Swipe-to-delete ────────────────────────────────────────────────────────
function initSwipe(wrapper, item){
    const row = wrapper.querySelector('.pantry-item');
    let startX=0, currentX=0, isDragging=false, isClick=false;
    const THRESHOLD = 80;

    function onStart(e){
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        isDragging=true; isClick=true;
        row.style.transition='none';
    }
    function onMove(e){
        if(!isDragging) return;
        currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
        if(Math.abs(currentX) > 6) isClick=false;
        if(currentX > 0) currentX=0;
        row.style.transform=`translateX(${currentX}px)`;
        wrapper.querySelector('.delete-bg').style.opacity = Math.min(Math.abs(currentX)/THRESHOLD, 1);
    }
    function onEnd(){
        if(!isDragging) return;
        isDragging=false;
        row.style.transition='transform .25s cubic-bezier(.16,1,.3,1), opacity .25s';
        if(Math.abs(currentX) >= THRESHOLD){
            deleteItem(wrapper);
        } else {
            row.style.transform='translateX(0)';
            wrapper.querySelector('.delete-bg').style.opacity=0;
            if(isClick) window.openItemDetail(item);
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

function deleteItem(wrapper){
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
        setTimeout(()=>{ wrapper.remove(); window.updateRecalledCount(); }, 320);
    }, 260);
}

window.updateRecalledCount = function updateRecalledCount(){
    const remaining = document.querySelectorAll('.pantry-item.recalled').length;
    const badge = document.getElementById('pantry-badge');
    if (!badge) return;
    badge.textContent = remaining;
    badge.style.display = remaining===0 ? 'none' : '';
};

// ── Pantry filter ──────────────────────────────────────────────────────────
window.filterPantry = function filterPantry(btn, cat){
    document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    window.renderPantry(cat);
};
