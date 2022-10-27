const userTypeAgent = document.querySelector(".user-type .agent");
const userTypeIndividual = document.querySelector(".user-type .individual");

const userTypeValue = document.querySelector(".user-type-value")

setAgent = () => {
    console.log(userTypeValue.value);
    userTypeValue.value = "Agent";
    userTypeIndividual.classList.remove("selected")
    userTypeAgent.classList.add("selected")
}

setIndividual = () => {
    console.log(userTypeValue.value);
    userTypeValue.value = "Individual";
    userTypeAgent.classList.remove("selected")
    userTypeIndividual.classList.add("selected")
}

userTypeAgent.addEventListener("click", setAgent);
userTypeIndividual.addEventListener("click", setIndividual);