// infinite scrolling
const PER_PAGE = 6;

let loadMoreCount = 1;
let loading = false;

window.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/") {
        window.addEventListener("scroll", onScrollLoad);
    }
})

async function onScrollLoad() {
    if (loading) return;        // if it's loading, doesn't do anything

    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200; // bottom it's true if it's near the bottom of the page

    if (bottom) {
        loading = true;
        await loadMoreClothes();
        loading = false;
    }
}

async function loadMoreClothes() {
    const from = loadMoreCount * PER_PAGE;
    const to = from + PER_PAGE;

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";      // if it's false, "" (OR)
    const category = params.get("category") || "";

    const container = document.getElementById("clothesContainer");

    const response = await fetch(`/loadMoreClothes?from=${from}&to=${to}&search=${search}&category=${category}`);
    const html = await response.text();

    container.innerHTML += html;

    loadMoreCount++;
}