document.addEventListener("DOMContentLoaded", () => {       // wait for the HTML document to load before running the script
    const form = document.getElementById("clotheForm");     // get the form
    if (!form) return;                                      // if the form doesnt exist, exit

    // fields
    const name = document.getElementById("name");
    const price = document.getElementById("price");
    const description = document.getElementById("description");
    const sizeSneakers = document.getElementById("sizeSneakers");
    const imageInput = document.getElementById("file");

    // submit button and the loading spinner/text
    const submitBtn = document.getElementById("submitBtn");
    const formSpinner = document.getElementById("formSpinner");
    const btnText = document.getElementById("btnText");

    // mark an input as invalid and show error message
    function setInvalid(input, errorId, message) {
        input.classList.add("is-invalid");
        const error = document.getElementById(errorId);
        if (error) error.textContent = message;
    }

    // mark an input as valid and clear error message
    function setValid(input, errorId) {
        input.classList.remove("is-invalid");
        const error = document.getElementById(errorId);
        if (error) error.textContent = "";
    }

    // show error for category and size (not inputs)
    function setGroupError(errorId, message) {
        const error = document.getElementById(errorId);
        if (error) error.textContent = message;
    }

    // clear error for category and size
    function clearGroupError(errorId) {
        const error = document.getElementById(errorId);
        if (error) error.textContent = "";
    }

    // real-time validation for the name
    name.addEventListener("input", async () => {
        const value = name.value.trim();

        if (value === "") {         // name is required
            setInvalid(name, "error-name", "El nombre es obligatorio.");
            return;
        }

        const firstChar = value.charAt(0);
        if (firstChar !== firstChar.toUpperCase()) {        // must start with uppercase letter
            setInvalid(name, "error-name", "El nombre debe empezar por una letra mayúscula.");
            return;
        }

        // check if the name already exists
        const response = await fetch("/validateName?name=" + encodeURIComponent(value));
        const data = await response.json();

        if (data.exists) {          // duplicate name found
            setInvalid(name, "error-name", "Ya existe una prenda con ese nombre.");
            return;
        }

        setValid(name, "error-name");       // name is valid
    });

    // real-time validation for the price
    price.addEventListener("input", () => {
        const value = price.value.trim();

        if (value === "") {     // price is required
            setInvalid(price, "error-price", "El precio es obligatorio.");
            return;
        }

        const priceNumber = Number(value);

        if (Number.isNaN(priceNumber) || priceNumber <= 0) {        // price must be a number higher than 0
            setInvalid(price, "error-price", "El precio debe ser un número mayor que 0.");
            return;
        }

        setValid(price, "error-price");     // price is valid
    });

    // real-time validation for the description
    description.addEventListener("input", () => {
        const length = description.value.length;

        if (length < 10 || length > 250) {      // description must have between 10 and 250 characters
            setInvalid(description, "error-description", "La descripción debe tener entre 10 y 250 caracteres.");
            return;
        }

        setValid(description, "error-description");     // description is valid
    });

    // real-time validation for sneakers numeric size
    sizeSneakers.addEventListener("input", () => {
        const sneakersChecked = document.getElementById("sneakers").checked;

        if (!sneakersChecked) {
            setValid(sizeSneakers, "error-sizeSneakers");
            return;
        }

        if (sizeSneakers.value.trim() === "") {     // must enter a numeric size for sneakers
            setInvalid(sizeSneakers, "error-sizeSneakers", "Debes introducir una talla numérica para zapatillas.");
            return;
        }

        setValid(sizeSneakers, "error-sizeSneakers");
    });

    // when an image is selected, remove invalid styling
    imageInput.addEventListener("change", () => {
        if (imageInput.files && imageInput.files.length > 0) {
            imageInput.classList.remove("is-invalid");
        }
    });

    // category buttons
    const categories = document.querySelectorAll('input[name="category"]');

    // clear error when any is selected
    for (let i = 0; i < categories.length; i++) {
        categories[i].addEventListener("change", () => {
            clearGroupError("error-category");
        });
    }

    // size buttons
    const sizes = document.querySelectorAll('input[name="size"]');

    // clear error when any is selected
    for (let i = 0; i < sizes.length; i++) {
        sizes[i].addEventListener("change", () => {
            clearGroupError("error-size");
        });
    }

    // clear sizes button
    const clearSize = document.getElementById("clearSize")

    // uncheck all size buttons and clear error
    clearSize.addEventListener("click", () => {
        for (let i = 0; i < sizes.length; i++) {
            sizes[i].checked = false;
        }
        clearGroupError("error-size");
    });

    // client-side validation before submit
    function validateClient() {
        let valid = true;

        imageInput.classList.remove("is-invalid");

        // name validation
        if (name.value.trim() === "") {
            setInvalid(name, "error-name", "El nombre es obligatorio.")
            valid = false;
        } else {
            setValid(name, "error-name");
        }

        // price validation
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

        // description length
        if (description.value.length < 10 || description.value.length > 250) {
            setInvalid(description, "error-description", "La descripción debe tener entre 10 y 250 caracteres.");
            valid = false;
        } else {
            setValid(description, "error-description");
        }

        // category selection check
        let categorySelected = false;

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].checked) {
                categorySelected = true;
            }
        }

        if (!categorySelected) {
            setGroupError("error-category", "Debes seleccionar una categoría.");
            valid = false;
        } else {
            clearGroupError("error-category");
        }

        const sneakersChecked = document.getElementById("sneakers").checked;

        // size validation depending on category
        if (!categorySelected) {
            setGroupError("error-size", "Debes seleccionar una talla.");
            valid = false;
        }
        else if (sneakersChecked) {
            if (sizeSneakers.value.trim() === "") {
                setInvalid(sizeSneakers, "error-sizeSneakers", "Debes introducir una talla numérica para zapatillas.");
                valid = false;
            } else {
                setValid(sizeSneakers, "error-sizeSneakers");
            }
            clearGroupError("error-size");
        }
        else {
            setValid(sizeSneakers, "error-sizeSneakers");

            let sizeSelected = false;

            for (let i = 0; i < sizes.length; i++) {
                if (sizes[i].checked) {
                    sizeSelected = true;
                }
            }

            if (!sizeSelected) {
                setGroupError("error-size", "Debes seleccionar una talla de camiseta / vestido / pantalón.");
                valid = false;
            } else {
                clearGroupError("errorSize");
            }
        }

        // image required only when creating
        const isEdit = form.action.includes("/edit");
        imageInput.classList.remove("is-invalid");

        if (!isEdit) {
            if (!imageInput.files || imageInput.files.length === 0) {
                imageInput.classList.add("is-invalid");
                valid = false;
            }
        }

        return valid;
    }

    // server-side name check before subit
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

    // show a bootstrpa modal with an error message
    function showErrorModal(text) {
        const modalError = document.getElementById("modalErrorText");
        modalError.innerHTML = text;
        new bootstrap.Modal(document.getElementById("errorModal")).show();
    }

    // form submission handler
    form.addEventListener("submit", async (e) => {
        e.preventDefault();     // prevent default form submission

        const clientValid = validateClient();       // run all client-side checks
        if (!clientValid) {
            console.warn("Errores de validación.");
        }

        // disable button and show loading spinner
        submitBtn.disabled = true;
        formSpinner.classList.remove("d-none");
        btnText.classList.add("d-none");
        
        // send form data to the shop
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        });

        const result = await response.json();

        // handle server errors
        if (!response.ok) {
        
            if (result.field === "name") {          // specific name duplicate error
                setInvalid(name, "error-name", result.message);
            } else {
                showErrorModal(result.message);     // error in modal
            }

            // re enable button
            submitBtn.disabled = false;
            formSpinner.classList.add("d-none");
            btnText.classList.remove("d-none");
            return;
        }

        // redirect to the new clothe's detail page
        window.location.href = "/clothe/" + result.id;
    });
});