document.addEventListener("DOMContentLoaded", ()=>{
    console.log("DOM load")

    const form = document.getElementById("delete-form");
    const spinner = document.getElementById("spinner-delete");

    if (!form){
        console.log("form doesnt exist");
    } else {
        console.log("form finded succesfully")
        form.addEventListener("submit", async (e) =>{
            e.preventDefault();
            console.log("Listener added")
            try{
                console.log("in try")
                spinner.classList.toggle("visually-hidden");
                const response = await fetch(form.action, {
                    method: form.method
                })
                spinner.classList.toggle("visually-hidden");
                console.log("respose load")
                if(response.ok){
                    window.location.href = response.url;
                    console.log("response succesfully");
                } else {
                    console.log(response.statusText);
                }
            } catch {
                console.log("Promise Fail");
            }
            
        })
    }
    
})


