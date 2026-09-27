/* AL.JUST — Pesquisa Premium
   Este script transforma a pesquisa que já existe no site.
   Não altera Supabase, produtos, carrinho, login ou administração.
*/
(function(){
  "use strict";

  const BOX_ID = "searchSuggestions";
  const INPUT_ID = "search";
  const MAX_RESULTS = 6;

  let processing = false;
  let lastSignature = "";

  function esc(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function getOriginalButtons(box){
    return Array.from(box.querySelectorAll(":scope > .suggestion-item, :scope > button.suggestion-item"));
  }

  function readButton(btn){
    const img = btn.querySelector(".suggestion-img img");
    const fallback = btn.querySelector(".suggestion-img")?.textContent?.trim() || "📦";
    const name = btn.querySelector(".suggestion-text strong")?.textContent?.trim() || "Produto";
    const small = btn.querySelector(".suggestion-text small")?.textContent?.trim() || "";
    const price = btn.querySelector(".suggestion-price")?.textContent?.trim() || "";

    let category = "Produto";
    let subcategory = "";
    let available = true;

    if(small){
      const parts = small.split("·").map(x=>x.trim()).filter(Boolean);
      category = parts[0] || category;

      const statusIndex = parts.findIndex(x => /dispon[ií]vel|esgotado/i.test(x));
      if(statusIndex >= 0){
        available = !/esgotado/i.test(parts[statusIndex]);
        if(statusIndex > 1) subcategory = parts.slice(1,statusIndex).join(" · ");
      }else if(parts.length > 1){
        subcategory = parts.slice(1).join(" · ");
      }
    }

    return {
      btn,
      imgSrc: img?.getAttribute("src") || "",
      fallback,
      name,
      category,
      subcategory,
      available,
      price
    };
  }

  function rowFrom(item){
    const row = item.btn.cloneNode(false);
    row.className = "aljust-search-row";
    row.removeAttribute("style");

    const imgHtml = item.imgSrc
      ? `<img src="${esc(item.imgSrc)}" alt="">`
      : `<span>${esc(item.fallback)}</span>`;

    row.innerHTML = `
      <span class="aljust-result-img">${imgHtml}</span>
      <span class="aljust-result-main">
        <span class="aljust-result-name">${esc(item.name)}</span>
        <span class="aljust-result-meta">
          <span>${esc(item.category)}</span>
          ${item.subcategory ? `<span class="dot">•</span><span class="subcat">${esc(item.subcategory)}</span>` : ""}
        </span>
      </span>
      <span class="aljust-result-right">
        <span class="aljust-result-price">${esc(item.price)}</span>
        <span class="aljust-result-stock ${item.available ? "" : "out"}">${item.available ? "Disponível" : "Esgotado"}</span>
      </span>
    `;
    return row;
  }

  function closeVisual(){
    document.body.classList.remove("aljust-search-open");
  }

  function openVisual(){
    document.body.classList.add("aljust-search-open");
  }

  function scrollToProducts(){
    const input = document.getElementById(INPUT_ID);
    const box = document.getElementById(BOX_ID);
    if(box) box.hidden = true;
    closeVisual();
    document.getElementById("produtos")?.scrollIntoView({behavior:"smooth", block:"start"});
    input?.blur();
  }

  function build(box){
    if(processing || !box || box.hidden) return;

    // Não reprocesse a nossa própria estrutura.
    if(box.querySelector(":scope > .aljust-search-panel")){
      openVisual();
      return;
    }

    const originalButtons = getOriginalButtons(box);

    // Estado "nenhum resultado"
    if(!originalButtons.length){
      const originalEmpty = box.querySelector(".search-empty");
      if(originalEmpty){
        processing = true;
        box.classList.add("aljust-premium-search");
        box.innerHTML = `
          <div class="aljust-search-panel">
            <div class="aljust-search-head">
              <span class="aljust-search-head-icon">⌕</span>
              <span class="aljust-search-head-title">Resultados da pesquisa</span>
              <span class="aljust-search-count">0 resultados encontrados</span>
            </div>
            <div class="aljust-search-empty">${esc(originalEmpty.textContent.trim())}</div>
          </div>
        `;
        processing = false;
        openVisual();
      }
      return;
    }

    const signature = originalButtons.map(b=>b.textContent.trim()).join("|");
    if(signature === lastSignature && box.querySelector(".aljust-search-panel")) return;
    lastSignature = signature;

    const all = originalButtons.map(readButton);
    const shown = all.slice(0, MAX_RESULTS);

    processing = true;

    const panel = document.createElement("div");
    panel.className = "aljust-search-panel";

    const head = document.createElement("div");
    head.className = "aljust-search-head";
    head.innerHTML = `
      <span class="aljust-search-head-icon">⌕</span>
      <span class="aljust-search-head-title">Resultados da pesquisa</span>
      <span class="aljust-search-count">${all.length}${all.length >= 8 ? "+" : ""} resultado${all.length === 1 ? "" : "s"} encontrado${all.length === 1 ? "" : "s"}</span>
    `;

    const list = document.createElement("div");
    list.className = "aljust-search-list";
    shown.forEach(item => list.appendChild(rowFrom(item)));

    const footer = document.createElement("div");
    footer.className = "aljust-search-footer";
    footer.setAttribute("role","button");
    footer.setAttribute("tabindex","0");
    footer.innerHTML = `
      <span class="aljust-grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span>Ver todos os resultados</span>
      <span aria-hidden="true">→</span>
    `;
    footer.addEventListener("click", scrollToProducts);
    footer.addEventListener("keydown", e=>{
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        scrollToProducts();
      }
    });

    panel.append(head, list, footer);
    box.innerHTML = "";
    box.appendChild(panel);
    box.classList.add("aljust-premium-search");
    processing = false;
    openVisual();
  }

  function init(){
    const box = document.getElementById(BOX_ID);
    const input = document.getElementById(INPUT_ID);
    if(!box || !input) return;

    const observer = new MutationObserver(()=>{
      if(processing) return;
      queueMicrotask(()=>{
        if(box.hidden){
          closeVisual();
          return;
        }
        build(box);
      });
    });

    observer.observe(box,{
      childList:true,
      subtree:false,
      attributes:true,
      attributeFilter:["hidden"]
    });

    input.addEventListener("input",()=>{
      // O script original volta a gerar os resultados; o observer estiliza em seguida.
      if(!input.value.trim()) closeVisual();
    });

    input.addEventListener("focus",()=>{
      setTimeout(()=> {
        if(!box.hidden) build(box);
      }, 0);
    });

    document.addEventListener("click", e=>{
      if(!e.target.closest(".search-wrap") && !e.target.closest("#searchSuggestions")){
        closeVisual();
      }
    });

    const hiddenObserver = new MutationObserver(()=>{
      if(box.hidden) closeVisual();
    });
    hiddenObserver.observe(box,{attributes:true, attributeFilter:["hidden"]});
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();