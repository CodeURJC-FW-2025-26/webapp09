document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("clotheForm");
    if (!form) return;

    const name = document.getElementById("name");
    const price = document.getElementById("price");
    const description = document.getElementById("description");
    const sizeSneakers = document.getElementById("sizeSneakers");
    const imageInput = document.getElementById("file");

    const submitBtn = document.getElementById("submitBtn");
    const formSpinner = document.getElementById("formSpinner");
    const btnText = document.getElementById("btnText");

    function setInvalid(input, errorId, message) {
        input.classList.add("is-invalid");
        const error = document.getElementById(errorId);
        if (error) error.textContent = message;
    }

    function setValid(input, errorId) {
        input.classList.remove("is-invalid");
        const error = document.getElementById(errorId);
        if (error) error.textContent = "";
    }

    function validateClient() {
        let valid = true;

        imageInput.classList.remove("is-invalid");

        if (name.value.length === 0) {
            setInvalid(name, "error-name", "El nombre es obligatorio.")
            valid = false;
        } else {
            setValid(name, "error-name");
        }

        if (price.value.trim() === "") {
            setInvalid(price, "error-price", "El precio es obligatorio.")
            valid = false;
        } else {
            const priceNumber = Number(price.value);

            if (Number.isNaN(priceNumber) || priceNumber <= 0) {
                setInvalid(price, "error-price", "El precio debe ser un número mayor que 0.");
                valid = false;
            } else {
                setValid(price, "error-price");
            }
        }

        if (description.value.length < 10 || description.value.length > 250) {
            setInvalid(description, "error-description", "La descripción debe tener entre 10 y 250 caracteres.");
            valid = false;
        } else {
            setValid(description, "error-description");
        }

        const sneakers = document.getElementById("sneakers").checked;

        if (sneakers) {
            if (sizeSneakers.value.length === 0) {
                setInvalid(sizeSneakers, "error-sizeSneakers", "Debes introducir la talla numérica.");
                valid = false;
            } else {
                setValid(sizeSneakers, "error-sizeSneakers");
            }
        } else {
            setValid(sizeSneakers, "error-sizeSneakers");
        }

        const edit = form.action.includes("/edit");
        if (!edit) {
            if (!imageInput.files || imageInput.files.length === 0) {
                imageInput.classList.add("is-invalid");
                valid = false;
            } else {
                imageInput.classList.remove("is-invalid");
            }
        }

        return valid;
    }

    async function validateNameServer() {
        const response = await fetch("/validateName?name=" + encodeURIComponent(name.value));
        const data = await response.json();

        if (data.exists) {
            setInvalid(name, "error-name", "Ya existe una prenda con ese nombre.");
            return false;
        }

        setValid(name, "error-name");
        return true;
    }

    function showErrorModal(text) {
        const modalError = document.getElementById("modalErrorText");
        if (modalError) modalError.innerHTML = text;
        new bootstrap.Modal(document.getElementById("errorModal")).show();
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateClient()) return;
        if (!(await validateNameServer())) return;

        submitBtn.disabled = true;
        formSpinner.classList.remove("d-none");
        btnText.classList.add("d-none");
        
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        });

        const result = await response.json();

        if (!response.ok) {
            showErrorModal(result.message);

            submitBtn.disabled = false;
            formSpinner.classList.add("d-none");
            btnText.classList.remove("d-none");
            return;
        }

        window.location.href = "/clothe/" + result.id;
    });
});