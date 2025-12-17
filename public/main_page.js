const PER_PAGE = 6;

let loadMoreCount = 1;
let loading = false;
let noMoreClothes = false;

const spinner = document.getElementById("indexSpinner");

// load the html
window.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/") {                 // you are in the main page
        window.addEventListener("scroll", onScrollLoad);    // when you scroll, onScrollLoad is executed
    }
})

async function onScrollLoad() {
    if (loading || noMoreClothes) return;        // if it's loading or there aren't more clothes, doesn't do anything

    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200; // to know if user's near the bottom of the page. If it's near, bottom = true

    if (bottom) {
        loading = true;
        await loadMoreClothes();
        loading = false;
    }
}

async function loadMoreClothes() {
    spinner.classList.toggle("d-none");

    const from = loadMoreCount * PER_PAGE;
    const to = from + PER_PAGE;

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";
    const category = params.get("category") || "";

    const response = await fetch(`/loadMoreClothes?from=${from}&to=${to}&search=${search}&category=${category}`);
    const data = await response.text();

    // if data is empty = no more clothes, so the scroll stops
    if (data.trim() === "") {
        noMoreClothes = true;
        window.removeEventListener("scroll", onScrollLoad);
    } else {
        const clothesContainer = document.getElementById("clothesContainer");
        clothesContainer.innerHTML += data;
        loadMoreCount++;
    }

    spinner.classList.toggle("d-none");
}