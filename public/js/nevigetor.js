const nev = document.querySelector(".main-header");
const nevbar = document.querySelector(".main-header__nav");
const nevbarTitle = document.getElementsByClassName("manu-title");
const floattingActionButton = document.querySelector(".floating-action-button");
const nevbarBackground = document.querySelector(".nevbar-background");

function mouseOver() {
    nev.style.animation= "drover-display1 .3s";
    for (var i = 0; i < nevbarTitle.length; i++) {
        nevbarTitle[i].style.animation= "scale-display .3s";
        nevbarTitle[i].style.display = "table-cell";
    }

}

function mouseOut() {
    nev.style.animation= "drover-display--reverse1 .3s"
    for (var i = 0; i < nevbarTitle.length; i++) {
        nevbarTitle[i].style.display = "none";
    }
}

function showNewBar() {
    nev.style.animation= "drover-display .3s";
    nevbar.style.display = "flex";
    floattingActionButton.style.display = "none";
    nevbarBackground.style.display = "flex";
}
function hideNewBar() {
    nev.style.animation= "drover-display--reverse .10s";
    nevbar.style.display = "none";
    floattingActionButton.style.display = "flex";
    floattingActionButton.style.animation= "scale-display .3s";
    nevbarBackground.style.display = "none";
}

if (screen.availWidth > 593) {
    nevbar.addEventListener("mouseover", mouseOver);
    nevbar.addEventListener("mouseout", mouseOut);
} else {
    floattingActionButton.addEventListener("click", showNewBar);
    nevbarBackground.addEventListener("click", hideNewBar);

}