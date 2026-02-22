let dados = [];

fetch('ervas.json')
.then(res => res.json())
.then(json => {
dados = json;

if (document.getElementById("lista-orixas")) {
carregarOrixas();
}

if (document.getElementById("tabela")) {
carregarErvasPorOrixa();
}
});

function carregarOrixas() {
let container = document.getElementById("lista-orixas");
let orixas = [...new Set(dados.map(e => e.orixa))];

orixas.forEach(o => {
let link = document.createElement("a");
link.href = `orixa.html?nome=${encodeURIComponent(o)}`;
link.textContent = o;
link.className = "card";
container.appendChild(link);
});
}

function carregarErvasPorOrixa() {
let params = new URLSearchParams(window.location.search);
let nome = params.get("nome");

document.getElementById("titulo-orixa").textContent = "Ervas de " + nome;

let filtradas = dados.filter(e => e.orixa === nome);

renderTabela(filtradas);

document.getElementById("busca").addEventListener("keyup", function() {
let texto = this.value.toLowerCase();
let resultado = filtradas.filter(e =>
e.popular.toLowerCase().includes(texto) ||
e.cientifico.toLowerCase().includes(texto)
);
renderTabela(resultado);
});
}

function renderTabela(lista) {
let tabela = document.getElementById("tabela");
tabela.innerHTML = "";

lista.forEach(e => {
tabela.innerHTML += `
<tr>
<td>${e.popular}</td>
<td>${e.cientifico}</td>
<td>${e.medicinal}</td>
<td>${e.espiritual}</td>
</tr>
`;
});
}
