document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-form");
  if (!form) {
    console.log("create-form no existe (¿está comentado el <form>?)");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const clotheId = document.body.dataset.clotheId;

    // Recoger datos del form
    const fd = new FormData(form);
    const body = new URLSearchParams(fd); // importante para req.body

    try {
      const res = await fetch(`/clothe/${clotheId}/review/new`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        // Modal de error reutilizando el tuyo
        const modalBody = document.getElementById("reviewErrorModalBody");
        if (modalBody) modalBody.textContent = data.message || "Error al guardar la reseña.";
        const modalEl = document.getElementById("reviewErrorModal");
        if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).show();
        return;
      }

      // ✅ limpiar campos
      form.user.value = "";
      form.title.value = "";
      form.review.value = "";

      // ✅ añadir a la lista si el server devuelve data.review con id
      if (data.review) {
        const section = document.getElementById("reviews-section");
        section?.insertAdjacentHTML("afterbegin", buildReviewCardHTML(data.review, clotheId));
      }

    } catch (err) {
      console.log("Promise fail", err);
    }
  });
});

function buildReviewCardHTML(r, clotheId) {
  const id = r.id;
  return `
    <div id="review-${id}" class="col-12 col-md-3 mb-3 review-item" data-review-id="${id}">
      <div class="card review shadow">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(r.title)}</h5>
          <h6 class="card-subtitle">${escapeHtml(r.user)}</h6>
          <p class="card-text">${escapeHtml(r.review)}</p>
          <div class="container p-0">
            <div class="row">
              <div class="col-6 text-end">
                <button type="button" class="btn text-end deleter-button"
                  data-url="/clothe/${clotheId}/review/${id}/delete">
                  <div class="spinner-border visually-hidden" role="status"></div>
                  <i class="bi bi-trash3 trash-icon"></i>
                </button>
                <button class="bi bi-pencil-square btn-editar-review"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
