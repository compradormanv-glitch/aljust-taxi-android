/* =========================================================
   AL.JUST - CORREÇÃO DEFINITIVA DA PESQUISA V3
   Uso: carregar este ficheiro APÓS o código atual da loja.
   Ele transforma a pesquisa antiga sem mexer em Supabase,
   carrinho, login, produtos ou administração.
   ========================================================= */
(function () {
  'use strict';

  const BOX_ID = 'searchSuggestions';
  const INPUT_ID = 'search';
  const MAX_VISIBLE = 6;
  let busy = false;

  const css = `
  body.aljust-search-v3-open::before{
    content:"";
    position:fixed;
    inset:0;
    background:rgba(12,34,55,.48);
    backdrop-filter:blur(1.5px);
    -webkit-backdrop-filter:blur(1.5px);
    z-index:850;
    pointer-events:none;
  }

  .topbar,.header,.mainnav{position:relative;z-index:900!important}
  .search-wrap{position:relative!important;z-index:1000!important}

  #${BOX_ID}.aljust-search-v3{
    position:absolute!important;
    left:50%!important;
    right:auto!important;
    top:calc(100% + 12px)!important;
    transform:translateX(-50%)!important;
    width:min(760px,88vw)!important;
    max-height:none!important;
    overflow:visible!important;
    padding:0!important;
    margin:0!important;
    background:#fff!important;
    border:1px solid #dde5ed!important;
    border-radius:14px!important;
    box-shadow:0 24px 55px rgba(10,37,63,.25)!important;
    z-index:1100!important;
  }

  #${BOX_ID}.aljust-search-v3[hidden]{display:none!important}

  .aljust-v3-panel{
    background:#fff;
    border-radius:14px;
    overflow:hidden;
  }

  .aljust-v3-head{
    min-height:54px;
    display:flex;
    align-items:center;
    gap:11px;
    padding:0 22px;
    border-bottom:1px solid #e6ebf0;
    background:#fff;
  }

  .aljust-v3-search-icon{
    width:26px;
    height:26px;
    border:3px solid #0a355d;
    border-radius:50%;
    position:relative;
    flex:0 0 auto;
  }

  .aljust-v3-search-icon::after{
    content:"";
    position:absolute;
    width:9px;
    height:3px;
    background:#0a355d;
    border-radius:3px;
    right:-7px;
    bottom:-3px;
    transform:rotate(45deg);
  }

  .aljust-v3-title{
    font-size:17px;
    font-weight:900;
    color:#0a3157;
  }

  .aljust-v3-count{
    margin-left:auto;
    color:#788a9e;
    font-size:13px;
    white-space:nowrap;
  }

  .aljust-v3-list{
    padding:0 22px;
  }

  #${BOX_ID} .aljust-v3-row{
    width:100%!important;
    min-height:78px!important;
    display:grid!important;
    grid-template-columns:78px minmax(0,1fr) 150px!important;
    align-items:center!important;
    gap:15px!important;
    padding:9px 0!important;
    margin:0!important;
    border:0!important;
    border-bottom:1px solid #e6ebf0!important;
    border-radius:0!important;
    background:#fff!important;
    text-align:left!important;
    cursor:pointer!important;
    font:inherit!important;
  }

  #${BOX_ID} .aljust-v3-row:hover{background:#f8fbfe!important}
  #${BOX_ID} .aljust-v3-row:last-child{border-bottom:0!important}

  .aljust-v3-img{
    width:74px;
    height:60px;
    border-radius:10px;
    background:#f1f4f7;
    overflow:hidden;
    display:grid;
    place-items:center;
    font-size:25px;
  }

  .aljust-v3-img img{
    width:100%;
    height:100%;
    object-fit:contain;
    display:block;
  }

  .aljust-v3-main{min-width:0}

  .aljust-v3-name{
    display:block;
    font-size:15px;
    line-height:1.25;
    color:#0b3156;
    font-weight:900;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .aljust-v3-meta{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    align-items:center;
    margin-top:6px;
    color:#667b91;
    font-size:13px;
  }

  .aljust-v3-meta-dot{color:#a7b1bd}

  .aljust-v3-right{
    text-align:right;
    align-self:center;
  }

  .aljust-v3-price{
    display:block;
    color:#f2202d;
    font-size:18px;
    line-height:1.1;
    font-weight:900;
    margin-bottom:6px;
  }

  .aljust-v3-stock{
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap:7px;
    color:#0bae58;
    font-size:13px;
    font-weight:900;
  }

  .aljust-v3-stock::before{
    content:"";
    width:9px;
    height:9px;
    border-radius:50%;
    background:currentColor;
  }

  .aljust-v3-stock.out{color:#b94444}

  .aljust-v3-footer{
    height:56px;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:12px;
    border-top:1px solid #e6ebf0;
    background:#fbfcfe;
    color:#f2202d;
    font-weight:900;
    cursor:pointer;
  }

  .aljust-v3-footer:hover{background:#f6f9fc}

  .aljust-v3-grid{
    display:grid;
    grid-template-columns:repeat(2,8px);
    gap:2px;
  }
  .aljust-v3-grid i{
    width:8px;height:8px;border-radius:2px;background:#f2202d;display:block;
  }

  .aljust-v3-empty{
    padding:28px 20px;
    text-align:center;
    color:#667b91;
    font-size:14px;
  }

  @media(max-width:760px){
    #${BOX_ID}.aljust-search-v3{
      position:fixed!important;
      top:135px!important;
      left:12px!important;
      right:12px!important;
      width:auto!important;
      transform:none!important;
      max-height:calc(100vh - 155px)!important;
      overflow:auto!important;
    }
    .aljust-v3-head,.aljust-v3-list{padding-left:14px;padding-right:14px}
    #${BOX_ID} .aljust-v3-row{
      grid-template-columns:60px minmax(0,1fr) 105px!important;
      gap:10px!important;
      min-height:72px!important;
    }
    .aljust-v3-img{width:58px;height:52px}
    .aljust-v3-name{font-size:14px}
    .aljust-v3-meta{font-size:11px}
    .aljust-v3-price{font-size:15px}
    .aljust-v3-stock{font-size:11px}
    .aljust-v3-count{display:none}
  }

  @media(max-width:470px){
    #${BOX_ID} .aljust-v3-row{grid-template-columns:52px minmax(0,1fr) 88px!important}
    .aljust-v3-img{width:50px;height:46px}
  }`;

  function installCss(){
    if(document.getElementById('aljust-search-v3-style')) return;
    const s=document.createElement('style');
    s.id='aljust-search-v3-style';
    s.textContent=css;
    document.head.appendChild(s);
  }

  function openOverlay(){
    document.body.classList.add('aljust-search-v3-open');
  }
  function closeOverlay(){
    document.body.classList.remove('aljust-search-v3-open');
  }

  function readItem(btn){
    const img=btn.querySelector('.suggestion-img img');
    const name=btn.querySelector('.suggestion-text strong')?.textContent?.trim() || 'Produto';
    const small=btn.querySelector('.suggestion-text small')?.textContent?.trim() || '';
    const price=btn.querySelector('.suggestion-price')?.textContent?.trim() || '';
    const bits=small.split('·').map(v=>v.trim()).filter(Boolean);
    const category=bits[0] || 'Produto';
    const status=(bits[bits.length-1] || '').toLowerCase();
    const available=!status.includes('esgotado');
    return {
      onclick:btn.getAttribute('onclick') || '',
      img:img?.getAttribute('src') || '',
      name, category, price, available
    };
  }

  function makeRow(item){
    const b=document.createElement('button');
    b.type='button';
    b.className='aljust-v3-row';
    if(item.onclick) b.setAttribute('onclick',item.onclick);

    b.innerHTML=`
      <span class="aljust-v3-img">${item.img?`<img src="${item.img.replaceAll('"','&quot;')}" alt="">`:'📦'}</span>
      <span class="aljust-v3-main">
        <span class="aljust-v3-name"></span>
        <span class="aljust-v3-meta"><span></span></span>
      </span>
      <span class="aljust-v3-right">
        <span class="aljust-v3-price"></span>
        <span class="aljust-v3-stock ${item.available?'':'out'}">${item.available?'Disponível':'Esgotado'}</span>
      </span>`;

    b.querySelector('.aljust-v3-name').textContent=item.name;
    b.querySelector('.aljust-v3-meta span').textContent=item.category;
    b.querySelector('.aljust-v3-price').textContent=item.price;
    return b;
  }

  function transform(){
    const box=document.getElementById(BOX_ID);
    if(!box || busy) return;

    if(box.hidden){
      closeOverlay();
      return;
    }

    // Se já está no formato novo, só mantém o overlay.
    if(box.firstElementChild?.classList.contains('aljust-v3-panel')){
      openOverlay();
      return;
    }

    const oldButtons=Array.from(box.querySelectorAll('.suggestion-item'));
    const oldEmpty=box.querySelector('.search-empty');

    if(!oldButtons.length && !oldEmpty) return;

    busy=true;
    box.classList.add('aljust-search-v3');

    const panel=document.createElement('div');
    panel.className='aljust-v3-panel';

    const head=document.createElement('div');
    head.className='aljust-v3-head';

    const count=oldButtons.length;
    head.innerHTML=`
      <span class="aljust-v3-search-icon" aria-hidden="true"></span>
      <span class="aljust-v3-title">Resultados da pesquisa</span>
      <span class="aljust-v3-count">${count} resultado${count===1?'':'s'} encontrado${count===1?'':'s'}</span>`;

    panel.appendChild(head);

    if(oldButtons.length){
      const list=document.createElement('div');
      list.className='aljust-v3-list';
      oldButtons.slice(0,MAX_VISIBLE).map(readItem).forEach(item=>list.appendChild(makeRow(item)));
      panel.appendChild(list);

      const footer=document.createElement('div');
      footer.className='aljust-v3-footer';
      footer.innerHTML=`<span class="aljust-v3-grid"><i></i><i></i><i></i><i></i></span><span>Ver todos os resultados</span><span>→</span>`;
      footer.addEventListener('click',()=>{
        box.hidden=true;
        closeOverlay();
        document.getElementById('produtos')?.scrollIntoView({behavior:'smooth',block:'start'});
      });
      panel.appendChild(footer);
    }else{
      const empty=document.createElement('div');
      empty.className='aljust-v3-empty';
      empty.textContent=oldEmpty.textContent.trim() || 'Não encontramos produtos para esta pesquisa.';
      panel.appendChild(empty);
    }

    box.replaceChildren(panel);
    busy=false;
    openOverlay();
  }

  function init(){
    installCss();

    const box=document.getElementById(BOX_ID);
    const input=document.getElementById(INPUT_ID);
    if(!box || !input){
      console.warn('[AL.JUST pesquisa V3] Elementos de pesquisa não encontrados.');
      return;
    }

    const obs=new MutationObserver(()=>{
      if(busy) return;
      setTimeout(transform,0);
    });

    obs.observe(box,{
      childList:true,
      subtree:true,
      attributes:true,
      attributeFilter:['hidden']
    });

    input.addEventListener('input',()=>setTimeout(transform,10));
    input.addEventListener('focus',()=>setTimeout(transform,10));

    document.addEventListener('click',e=>{
      if(!e.target.closest('.search-wrap') && !e.target.closest('#'+BOX_ID)){
        closeOverlay();
      }
    },true);

    setTimeout(transform,50);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();