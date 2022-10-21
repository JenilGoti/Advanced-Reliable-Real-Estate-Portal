const search = document.querySelector('.search')
const btn = document.querySelector('.btn')
const input = document.querySelector('.input')
const appTitle = document.querySelector('.main-title');

btn.addEventListener('click', () => {
    isDisplay = input.style.display == "none" || input.style.display == "";
    if (isDisplay) {
        input.style.animation = "scale-display .3s";
        input.style.display = "flex"
    } else {
        input.style.display = "none";
    }
    search.classList.toggle('active')
    input.focus()
    if (isDisplay) {
        btn.innerHTML = '<span class="material-symbols-outlined">close</span>'
    } else {
        btn.innerHTML = '<span class="material-symbols-outlined">search</span>'
    }
    if (screen.availWidth < 593) {
        isDisplay ? appTitle.style.display = "none" : appTitle.style.display = "flex"
    }
})