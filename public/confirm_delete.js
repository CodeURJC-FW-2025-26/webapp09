document.addEventListener("DOMContentLoaded", ()=>{
    console.log("DOM cargado")

    const form = document.getElementById("delete-form");

    form.addEventListener("submit", async (e) =>{
        e.preventDefault();

        const response = await fetch(form.action, {
            method: form.method
        })

        window.location.href = response.url;
    })
})


