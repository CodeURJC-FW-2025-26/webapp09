document.addEventListener("DOMContentLoaded", () => {

  const fileInput = document.getElementById("file");
  const dropArea = document.getElementById("dropArea");
  const previewContainer = document.getElementById("imagePreviewContainer");
  const previewImage = document.getElementById("imagePreview");
  const removeBtn = document.getElementById("removeImageBtn");
  const removeImageInput = document.getElementById("removeImage");

  function showPreview(file) {   //Ts is tho show a preview of the image
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      previewContainer.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
  }
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      showPreview(fileInput.files[0]);
      removeImageInput.value = "false";
    }
  });
  removeBtn.addEventListener("click", () => { //Ts is used to delete an image
    fileInput.value = "";
    previewImage.src = "";
    previewContainer.classList.add("d-none");
    removeImageInput.value = "true";
  });
  dropArea.addEventListener("dragover", (e) => { //This is used to drap an image in the form 
    e.preventDefault();
    dropArea.classList.add("bg-light");
  });
  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("bg-light");
  });
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("bg-light");
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      showPreview(e.dataTransfer.files[0]);
      removeImageInput.value = "false";
    }
  });

});
