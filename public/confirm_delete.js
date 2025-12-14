document.addEventListener("DOMContentLoaded", ()=>{
    console.log("DOM load")

    const form = document.getElementById("delete-form");

    if (!form){
        console.log("form doesnt exist");
    } else {
        
        form.addEventListener("submit", async (e) =>{
            e.preventDefault();
            try{
                const response = await fetch(form.action, {
                    method: form.method
                })

                if(response.ok){
                    window.location.href = response.url;
                } else {
                    console.log(response.statusText);
                }

            } catch {
                console.log("Promise Fail");
            }
            
        })
    }
    
})


