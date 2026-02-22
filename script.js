let dados = [];
let cacheOrixas = {};

/* =========================
   CARREGAR JSON
========================= */
fetch('ervas.json')
  .then(res => {
    if (!res.ok) throw new Error("Erro ao carregar ervas.json");
    return res.json();
  })
  .then(json => {
    dados = json;

    if (document.getElementById("lista-orixas")) {
      carregarOrixas();
    }

    if (document.getElementById("lista-ervas")) {
      carregarErvas();
    }
  })
  .catch(err => console.error(err));


/* =========================
   MODO ESCURO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnDark = document.getElementById("toggleDark");

  if (btnDark) {
    btnDark.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });
  }

  // manter modo escuro salvo
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
});


/* =========================
   LISTAR ORIXÁS (index.html)
========================= */
function carregarOrixas() {
  const container = document.getElementById("lista-orixas");
  if (!container) return;

  const orixas = [...new Set(dados.map(e => e.orixa))].sort();

  orixas.forEach(o => {
    const card = document.createElement("a");
    card.href = `orixa.html?nome=${encodeURIComponent(o)}`;
    card.className = "card";
    card.innerHTML = `<h3>${o}</h3>`;
    container.appendChild(card);
  });
}


/* =========================
   CARREGAR ERVAS POR ORIXÁ
========================= */
function carregarErvas() {
  const params = new URLSearchParams(window.location.search);
  const nome = params.get("nome");
  if (!nome) return;

  const titulo = document.getElementById("titulo-orixa");
  if (titulo) titulo.textContent = nome;

  const filtradas = dados.filter(e => e.orixa === nome);
  cacheOrixas[nome] = filtradas;

  renderEnciclopedia(filtradas);

  const busca = document.getElementById("busca");
  const filtro = document.getElementById("filtroClassificacao");

  if (busca) busca.addEventListener("keyup", aplicarFiltros);
  if (filtro) filtro.addEventListener("change", aplicarFiltros);

  function aplicarFiltros() {
    const texto = busca ? busca.value.toLowerCase() : "";
    const classe = filtro ? filtro.value : "";

    const resultado = cacheOrixas[nome].filter(e => {

      const matchTexto =
        e.popular.toLowerCase().includes(texto) ||
        e.cientifico.toLowerCase().includes(texto);

      const matchClasse =
        classe === "" || e.classificacao === classe;

      return matchTexto && matchClasse;
    });

    renderEnciclopedia(resultado);
  }
}


/* =========================
   RENDERIZAR ERVAS
========================= */
function renderEnciclopedia(lista) {

  const container = document.getElementById("lista-ervas");
  if (!container) return;

  container.innerHTML = "";

  lista.forEach(e => {

    const idSeguro = e.cientifico.replace(/\s/g, "_");

    container.innerHTML += `
      <div class="erva-card">

        <img id="img-${idSeguro}" 
             class="erva-img"
             src="imagens/placeholder.jpg">

        <h3>${e.popular}</h3>

        ${e.classificacao ? 
          `<span class="badge badge-${e.classificacao.toLowerCase()}">
             ${e.classificacao}
           </span>` 
         : ""}

        <p><strong>Científico:</strong> ${e.cientifico}</p>
        <p><strong>Medicinal:</strong> ${e.medicinal}</p>
        <p><strong>Espiritual:</strong> ${e.espiritual}</p>

      </div>
    `;

    buscarImagemWikipedia(e.cientifico, idSeguro);
  });
}


/* =========================
   BUSCAR IMAGEM WIKIPEDIA
========================= */
function buscarImagemWikipedia(nomeCientifico, idSeguro) {

  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nomeCientifico)}`)
    .then(res => res.json())
    .then(data => {

      if (data.thumbnail && data.thumbnail.source) {
        const img = document.getElementById(`img-${idSeguro}`);
        if (img) {
          img.src = data.thumbnail.source;
        }
      }

    })
    .catch(() => {});
}
