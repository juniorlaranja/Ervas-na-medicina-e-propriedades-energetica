document.getElementById("searchInput").addEventListener("keyup", function() {
let filter = this.value.toUpperCase();
let links = document.querySelectorAll(".card");

links.forEach(link => {
if (link.textContent.toUpperCase().indexOf(filter) > -1) {
link.style.display = "";
} else {
link.style.display = "none";
}
});
});
