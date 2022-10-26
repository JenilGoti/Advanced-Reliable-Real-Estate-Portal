const userImage = document.querySelector(".user-image");
const uploadedImage = document.querySelector("#image");
const saveBtn = document.querySelector(".save");

function updateImage() {
    updatedImageUrl = uploadedImage.value;
    console.log(updatedImageUrl);
    saveBtn.style.display = "unset";
    userImage.src = window.URL.createObjectURL(uploadedImage.files[0]);
}

uploadedImage.addEventListener("change", updateImage);