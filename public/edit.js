document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-editar-review");
    if (!btn) return;

    e.preventDefault();
    editarReview(btn);
  });
});

function editarReview(buttonEl) {
  const reviewItem = buttonEl.closest(".review-item");
  if (!reviewItem) return;

  const cardBody = reviewItem.querySelector(".card-body");
  if (!cardBody) return;

  // Save the old html
  const originalHTML = cardBody.innerHTML;

  // Actual data
  const title = cardBody.querySelector(".card-title")?.textContent.trim() ?? "";
  const user = cardBody.querySelector(".card-subtitle")?.textContent.trim() ?? "";
  const reviewText = cardBody.querySelector(".card-text")?.textContent.trim() ?? "";
  const reviewId = reviewItem.dataset.reviewId;

  const clotheId = document.body.dataset.clotheId;
  if (!clotheId) {
    console.error("Falta data-clothe-id en <body>");
    return;
  }
  if (!reviewId) {
    console.error("Falta data-review-id en .review-item");
    return;
  }

  // Create form
  cardBody.innerHTML = `
    <form class="edit-review-form">
      <input type="hidden" name="formSource" value="edit_review">
      <input type="hidden" name="reviewId" value="${escapeHtml(reviewId)}">

      <div class="mb-2">
        <input class="form-control" name="user" value="${escapeHtml(user)}"
               placeholder="Introduce tu nombre de usuario" required>
      </div>

      <div class="mb-2">
        <input class="form-control" name="title" value="${escapeHtml(title)}"
               placeholder="Resume tu opinión en una línea" required>
      </div>

      <div class="mb-2">
        <textarea class="form-control" name="review" rows="3"
          placeholder="Escribe tu reseña" required>${escapeHtml(reviewText)}</textarea>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-secondary cancel-edit">Cancelar</button>
        <button type="submit" class="btn btn-dark">Enviar</button>
      </div>

      <div class="mt-2 small text-danger d-none form-error"></div>
    </form>
  `;

  // gobkack
  cardBody.querySelector(".cancel-edit").addEventListener("click", () => {
    cardBody.innerHTML = originalHTML;
  });

  // Submit AJAX
  const form = cardBody.querySelector(".edit-review-form");
  const errBox = cardBody.querySelector(".form-error");

 form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  try {
    const fd = new FormData(form);
    const body = new URLSearchParams(fd);

    const res = await fetch(`/clothe/${clotheId}/review/new`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await res.json().catch(() => ({}));

    // Error handler
    if (!res.ok || data.ok === false) {
      showReviewError(data.message || "Ha ocurrido un error al procesar la reseña.");
      return;
    }

    // Change to the def view
    const updated = data.review;
    cardBody.innerHTML = renderReviewBody(updated.title, updated.user, updated.review, originalHTML);

  } catch (err) {
    showReviewError("Error de red al guardar la reseña.");
  }
});
}

// Weird characters handler
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function showReviewError(message) {
  const body = document.getElementById("reviewErrorModalBody");
  body.textContent = message;

  const modalEl = document.getElementById("reviewErrorModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function renderReviewBody(title, user, reviewText, fallbackOriginalHTML) {

  return `
    <h5 class="card-title">${escapeHtml(title)}</h5>
    <h6 class="card-subtitle">${escapeHtml(user)}</h6>
    <p class="card-text">${escapeHtml(reviewText)}</p>
    ${extractButtonsHtml(fallbackOriginalHTML)}
  `;
}

// Reutilize previous buttons on the original card
function extractButtonsHtml(originalHTML) {
  const tmp = document.createElement("div");
  tmp.innerHTML = originalHTML;

  const container = tmp.querySelector(".container");
  return container ? container.outerHTML : "";
}