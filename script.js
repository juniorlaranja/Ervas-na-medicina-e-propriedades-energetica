let dados = [];
let cacheOrixas = {};

fetch('ervas.json')
.then(res => res.json())
.then(json => {
dados = json;

if (document.getElementById("lista-orixas")) {
carregarOrixas();
}

if (document.getElementById("lista-ervas")) {
carregarErvas();
}
});

// MENU FIXO MODO ESCURO
const btnDark = document.getElementById("toggleDark");
if (btnDark) {
btnDark.addEventListener("click", () => {
document.body.classList.toggle("dark");
});
}

// ORIXAS
function carregarOrixas() {
let container = document.getElementById("lista-orixas");

let orixas = [...new Set(dados.map(e => e.orixa))];

orixas.forEach(o => {
let card = document.createElement("a");
card.href = `orixa.html?nome=${encodeURIComponent(o)}`;
card.className = "card";
card.innerHTML = `
<div class="orixa-icon">${iconeOrixa(o)}</div>
<h3>${o}</h3>
`;
container.appendChild(card);
});
}

// ENCICLOPÉDIA
function carregarErvas() {
let params = new URLSearchParams(window.location.search);
let nome = params.get("nome");

document.getElementById("titulo-orixa").textContent = nome;

let filtradas = dados.filter(e => e.orixa === nome);
cacheOrixas[nome] = filtradas;

renderEnciclopedia(filtradas);

document.getElementById("busca").addEventListener("keyup", function() {
let texto = this.value.toLowerCase();
let resultado = cacheOrixas[nome].filter(e =>
e.popular.toLowerCase().includes(texto) ||
e.cientifico.toLowerCase().includes(texto)
);
renderEnciclopedia(resultado);
});
}

function renderEnciclopedia(lista) {
let container = document.getElementById("lista-ervas");
container.innerHTML = "";

lista.forEach(e => {
container.innerHTML += `
<div class="erva-card">
<h3>${e.popular}</h3>
<p><strong>Científico:</strong> ${e.cientifico}</p>
<p><strong>Medicinal:</strong> ${e.medicinal}</p>
<p><strong>Espiritual:</strong> ${e.espiritual}</p>
</div>
`;
});
}

// ÍCONES SIMPLES
function iconeOrixa(nome) {
const mapa = {
"Oxalá": "⚪",
"Iemanjá": "🌊",
"Ogum": "⚔️",
"Xangô": "⚡",
"Oxóssi": "🏹",
"Oxum": "💛",
"Iansã": "🌪️",
"Nanã": "🟣"
};
return mapa[nome] || "🌿";
}
