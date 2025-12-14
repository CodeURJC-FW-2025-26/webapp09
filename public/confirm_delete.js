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

    const reviewSection = document.getElementById("reviews-section");

    if(!reviewSection){
        console.log("review section not found");
    } else {
        console.log("review section found");
        reviewSection.addEventListener("click", async (e)=>{
            const button = e.target.closest(".deleter-button");
            const spinner = button.closest(".col-6").querySelector(".spinner-border");

            console.log(button.innerHTML);

            if(!button){
                return;
            }

            spinner.classList.toggle("visually-hidden");
            
            console.log("Deleted Button Pressed");
            const deleteURL = button.dataset.url;

            console.log(`Delet URL = ${deleteURL}`);
            const response = await fetch(deleteURL, {
                method: "POST"
            });

            if(response.ok){
                const data = await response.json();

                console.log("deleted succesfully");
                
                console.log(`Id searching: ${data.id}`);
                const deletedReview = e.target.closest(".col-12");

                if(!deletedReview){
                    console.log("review card not found");
                } else {
                    deletedReview.remove();
                    spinner.classList.toggle("visually-hidden");
                    console.log("deleted review card");
                }
                
            } else {
                console.log("Server error");
            }
            
            

        })
    }
    
})


