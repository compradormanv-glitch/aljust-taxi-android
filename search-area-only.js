/* Al.just — PATCH SOMENTE DA ÁREA DE PESQUISA
   Não altera catálogo, carrinho, checkout, Admin ou Supabase.
   O ficheiro substitui apenas a apresentação/comportamento do dropdown da pesquisa.
*/
(function () {
  "use strict";

  function init() {
    const input = document.getElementById("search");
    const box = document.getElementById("searchSuggestions");
    const wrap = input?.closest(".search-wrap");
    if (!input || !box || !wrap) return;

    // Evita carregar duas vezes.
    if (window.__ALJUST_SEARCH_ONLY_PATCH__) return;
    window.__ALJUST_SEARCH_ONLY_PATCH__ = true;

    const STYLE_ID = "aljust-search-only-patch-style";
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        /* ===== Al.just — pesquisa ===== */
        .search-wrap { position:relative; z-index:100; }

        #searchSuggestions.aljust-search-panel {
          position:absolute !important;
          left:50% !important;
          right:auto !important;
          top:calc(100% + 10px) !important;
          transform:translateX(-50%) !important;
          width:min(760px, 74vw) !important;
          max-height:none !important;
          overflow:hidden !important;
          padding:0 !important;
          background:#fff !important;
          border:1px solid #dfe7ef !important;
          border-radius:14px !important;
          box-shadow:0 22px 55px rgba(10,47,82,.22) !important;
          z-index:1001 !important;
          color:#142f4c !important;
        }

        #searchSuggestions.aljust-search-panel[hidden] { display:none !important; }

        .aljust-search-panel__head {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          padding:17px 22px 14px;
          background:#fff;
          border-bottom:1px solid #edf1f5;
        }

        .aljust-search-panel__title {
          display:flex;
          align-items:center;
          gap:12px;
          font-size:16px;
          font-weight:800;
          color:#17395d;
        }

        .aljust-search-panel__title-icon {
          width:22px;
          height:22px;
          display:grid;
          place-items:center;
          font-size:21px;
          line-height:1;
        }

        .aljust-search-panel__count {
          color:#7b8b9c;
          font-size:12px;
          white-space:nowrap;
        }

        .aljust-search-panel__list {
          background:#fff;
          padding:0 18px;
        }

        .aljust-search-result {
          width:100%;
          display:grid;
          grid-template-columns:74px minmax(0, 1fr) 170px;
          align-items:center;
          gap:14px;
          min-height:78px;
          padding:10px 10px;
          border:0;
          border-bottom:1px solid #edf1f5;
          background:#fff;
          text-align:left;
          cursor:pointer;
          font:inherit;
          color:inherit;
        }

        .aljust-search-result:last-child {
          border-bottom:0;
        }

        .aljust-search-result:hover,
        .aljust-search-result:focus-visible {
          background:#f8fbfe;
          outline:none;
        }

        .aljust-search-result__img {
          width:64px;
          height:56px;
          border-radius:10px;
          display:grid;
          place-items:center;
          overflow:hidden;
          background:#f3f6f9;
          border:1px solid #e8edf2;
          color:#7d8da0;
          font-size:25px;
        }

        .aljust-search-result__img img {
          width:100%;
          height:100%;
          object-fit:contain;
          display:block;
        }

        .aljust-search-result__main {
          min-width:0;
        }

        .aljust-search-result__name {
          display:block;
          color:#14385c;
          font-size:14px;
          font-weight:800;
          line-height:1.25;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        .aljust-search-result__meta {
          display:flex;
          flex-wrap:wrap;
          gap:5px;
          align-items:center;
          margin-top:6px;
          color:#74869a;
          font-size:12px;
          line-height:1.25;
        }

        .aljust-search-result__meta .dot {
          color:#a8b4c0;
        }

        .aljust-search-result__side {
          display:flex;
          flex-direction:column;
          align-items:flex-end;
          justify-content:center;
          min-width:0;
        }

        .aljust-search-result__price {
          color:#e51d2a;
          font-size:16px;
          font-weight:900;
          line-height:1.1;
          white-space:nowrap;
        }

        .aljust-search-result__stock {
          display:flex;
          align-items:center;
          gap:6px;
          margin-top:7px;
          font-size:12px;
          font-weight:700;
          white-space:nowrap;
        }

        .aljust-search-result__stock::before {
          content:"";
          width:8px;
          height:8px;
          border-radius:50%;
          background:#16a65a;
          flex:0 0 auto;
        }

        .aljust-search-result__stock.out {
          color:#c03333;
        }

        .aljust-search-result__stock.out::before {
          background:#d64545;
        }

        .aljust-search-panel__empty {
          padding:24px 22px;
          color:#687b8f;
          font-size:13px;
          text-align:center;
        }

        .aljust-search-panel__footer {
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          width:100%;
          min-height:54px;
          border:0;
          border-top:1px solid #e9eef3;
          background:#f8fafc;
          color:#e51d2a;
          font:inherit;
          font-size:13px;
          font-weight:900;
          cursor:pointer;
        }

        .aljust-search-panel__footer:hover {
          background:#f1f6fa;
        }

        .aljust-search-panel__footer-icon {
          display:inline-grid;
          grid-template-columns:repeat(2,6px);
          grid-template-rows:repeat(2,6px);
          gap:2px;
        }

        .aljust-search-panel__footer-icon i {
          width:6px;
          height:6px;
          border-radius:2px;
          background:#e51d2a;
          display:block;
        }

        .aljust-search-backdrop {
          position:fixed;
          inset:0;
          background:rgba(7,27,47,.30);
          z-index:999;
          display:none;
          pointer-events:auto;
        }

        body.aljust-search-open .aljust-search-backdrop {
          display:block;
        }

        body.aljust-search-open #searchSuggestions {
          z-index:1001 !important;
        }

        /* Mantém o cabeçalho e o painel visuais mesmo com o sticky header original. */
        body.aljust-search-open .header,
        body.aljust-search-open .topbar,
        body.aljust-search-open .mainnav {
          position:relative;
          z-index:1000;
        }

        @media (max-width: 980px) {
          #searchSuggestions.aljust-search-panel {
            width:min(680px, 92vw) !important;
          }
        }

        @media (max-width: 650px) {
          #searchSuggestions.aljust-search-panel {
            left:0 !important;
            right:0 !important;
            transform:none !important;
            width:100% !important;
            top:calc(100% + 6px) !important;
          }

          .aljust-search-panel__head {
            padding:14px 15px 12px;
          }

          .aljust-search-panel__list {
            padding:0 9px;
          }

          .aljust-search-result {
            grid-template-columns:58px minmax(0,1fr);
            gap:10px;
            min-height:72px;
            padding:9px 7px;
          }

          .aljust-search-result__img {
            width:52px;
            height:48px;
          }

          .aljust-search-result__side {
            grid-column:2;
            align-items:flex-start;
            flex-direction:row;
            gap:12px;
          }

          .aljust-search-result__stock {
            margin-top:0;
          }

          .aljust-search-result__name {
            white-space:normal;
          }
        }
      `;
      document.head.appendChild(style);
    }

    let backdrop = document.querySelector(".aljust-search-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "aljust-search-backdrop";
      document.body.appendChild(backdrop);
    }

    box.classList.add("aljust-search-panel");

    function esc(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function normalize(value) {
      return String(value ?? "")
        .normalize("NFD")
        .replace(/[\\u0300-\\u036f]/g, "")
        .toLowerCase()
        .trim();
    }

    function moneySafe(value) {
      try {
        if (typeof money === "function") return money(value);
      } catch (_) {}
      return `${new Intl.NumberFormat("pt-AO").format(Number(value || 0))} Kz`;
    }

    function getData(product) {
      try {
        if (typeof getProductData === "function") return getProductData(product?.description);
      } catch (_) {}
      return { text: "", ficha: {} };
    }

    function searchText(product) {
      try {
        if (typeof getSearchText === "function") return getSearchText(product);
      } catch (_) {}
      const data = getData(product);
      const f = data?.ficha || {};
      return [
        product?.name,
        product?.category,
        data?.text,
        f.marca,
        f.modelo,
        f.referencia,
        f.subcategoria,
        f.cor,
        f.material,
        f.especificacoes
      ].filter(Boolean).join(" ");
    }

    function imageFor(product) {
      try {
        if (typeof cachedImage === "function") return cachedImage(product) || "";
      } catch (_) {}
      return product?.image_url || "";
    }

    function subcategoryFor(product) {
      const data = getData(product);
      return data?.ficha?.subcategoria || "";
    }

    function matches(product, query) {
      return !query || normalize(searchText(product)).includes(normalize(query));
    }

    function getProducts() {
      try {
        if (typeof products !== "undefined" && Array.isArray(products)) return products;
      } catch (_) {}
      return [];
    }

    function openDetail(id) {
      try {
        if (typeof window.chooseSearchProduct === "function") {
          window.chooseSearchProduct(String(id));
          return;
        }
      } catch (_) {}
      try {
        if (typeof window.openProductDetail === "function") {
          window.openProductDetail(String(id));
          return;
        }
      } catch (_) {}
      const p = getProducts().find(x => String(x.id) === String(id));
      if (p) {
        input.value = p.name || "";
      }
    }

    function openPanel() {
      if (!input.value.trim()) {
        closePanel();
        return;
      }
      box.hidden = false;
      document.body.classList.add("aljust-search-open");
    }

    function closePanel() {
      box.hidden = true;
      document.body.classList.remove("aljust-search-open");
    }

    function render() {
      const q = input.value.trim();
      if (!q) {
        closePanel();
        box.innerHTML = "";
        return;
      }

      let list = getProducts().filter(p => matches(p, q));
      const total = list.length;
      const visible = list.slice(0, 6);

      if (!total) {
        box.innerHTML = `
          <div class="aljust-search-panel__head">
            <div class="aljust-search-panel__title">
              <span class="aljust-search-panel__title-icon">⌕</span>
              <span>Resultados da pesquisa</span>
            </div>
            <span class="aljust-search-panel__count">0 resultados encontrados</span>
          </div>
          <div class="aljust-search-panel__empty">Não encontramos produtos para esta pesquisa.</div>
        `;
        openPanel();
        return;
      }

      const rows = visible.map((p) => {
        const sub = subcategoryFor(p);
        const cat = p?.category || "Produto";
        const available = Number(p?.stock) > 0;
        const img = imageFor(p);
        const name = p?.name || "Produto";

        return `
          <button type="button" class="aljust-search-result" data-aljust-search-id="${esc(p?.id)}">
            <span class="aljust-search-result__img">
              ${img
                ? `<img src="${esc(img)}" alt="" loading="lazy">`
                : `<span>▣</span>`}
            </span>

            <span class="aljust-search-result__main">
              <span class="aljust-search-result__name">${esc(name)}</span>
              <span class="aljust-search-result__meta">
                <span>${esc(cat)}</span>
                ${sub ? `<span class="dot">•</span><span>${esc(sub)}</span>` : ""}
              </span>
            </span>

            <span class="aljust-search-result__side">
              <span class="aljust-search-result__price">${esc(moneySafe(p?.price))}</span>
              <span class="aljust-search-result__stock ${available ? "" : "out"}">
                ${available ? "Disponível" : "Esgotado"}
              </span>
            </span>
          </button>
        `;
      }).join("");

      box.innerHTML = `
        <div class="aljust-search-panel__head">
          <div class="aljust-search-panel__title">
            <span class="aljust-search-panel__title-icon">⌕</span>
            <span>Resultados da pesquisa</span>
          </div>
          <span class="aljust-search-panel__count">${total} ${total === 1 ? "resultado" : "resultados"} encontrados</span>
        </div>

        <div class="aljust-search-panel__list">
          ${rows}
        </div>

        <button type="button" class="aljust-search-panel__footer" id="aljustSearchAll">
          <span class="aljust-search-panel__footer-icon">
            <i></i><i></i><i></i><i></i>
          </span>
          <span>Ver todos os resultados</span>
          <span aria-hidden="true">→</span>
        </button>
      `;

      box.querySelectorAll("[data-aljust-search-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-aljust-search-id");
          closePanel();
          openDetail(id);
        });
      });

      box.querySelector("#aljustSearchAll")?.addEventListener("click", () => {
        closePanel();
        try {
          document.getElementById("produtos")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        } catch (_) {}
      });

      openPanel();

      // O catálogo atual pode carregar as imagens do Supabase depois.
      // Quando isso acontece, redesenhamos apenas o painel da pesquisa.
      visible.slice(0, 6).forEach(p => {
        if (!imageFor(p) && typeof fetchProductImage === "function") {
          Promise.resolve(fetchProductImage(p.id))
            .then(() => {
              if (!box.hidden && input.value.trim()) render();
            })
            .catch(() => {});
        }
      });
    }

    // Sobrescreve somente a função de sugestões existente no index.html.
    // renderProducts, carrinho, checkout e restante do site continuam intactos.
    try {
      window.renderSearchSuggestions = render;
      if (typeof renderSearchSuggestions === "function") {
        renderSearchSuggestions = render;
      }
    } catch (_) {}

    input.addEventListener("input", () => {
      try {
        if (typeof window.renderProducts === "function") {
          window.renderProducts();
        }
      } catch (_) {}
      render();
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) render();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePanel();
        return;
      }
      if (event.key === "Enter") {
        closePanel();
        try {
          document.getElementById("produtos")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        } catch (_) {}
      }
    });

    backdrop.addEventListener("click", closePanel);

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".search-wrap")) closePanel();
    });

    // Atualiza quando os produtos são carregados/alterados no catálogo.
    const observer = new MutationObserver(() => {
      if (!box.hidden && input.value.trim()) render();
    });
    observer.observe(box, { childList: true, subtree: true });

    // Primeira renderização.
    if (input.value.trim()) render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
