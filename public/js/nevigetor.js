const nevbar = document.querySelector(".main-header__nav");
const nevbarTitle = document.getElementsByClassName("manu-title");
const floattingActionButton = document.querySelector(".floating-action-button");
const nevbarBackground = document.querySelector(".nevbar-background");

function mouseOver() {
    for (var i = 0; i < nevbarTitle.length; i++) {
        nevbarTitle[i].style.display = "table-cell";
    }

}

function mouseOut() {
    for (var i = 0; i < nevbarTitle.length; i++) {
        nevbarTitle[i].style.display = "none";
    }
}

function showNewBar() {
    nevbar.style.display = "flex";
    floattingActionButton.style.display = "none";
    nevbarBackground.style.display = "flex";
}
function hideNewBar() {
    nevbar.style.display = "none";
    floattingActionButton.style.display = "flex";
    nevbarBackground.style.display = "none";
}

if (screen.availWidth > 593) {
    nevbar.addEventListener("mouseover", mouseOver);
    nevbar.addEventListener("mouseout", mouseOut);
} else {
    floattingActionButton.addEventListener("click", showNewBar);
    nevbarBackground.addEventListener("click", hideNewBar);

}