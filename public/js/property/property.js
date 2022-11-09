let slideIndex = 1;
const propertyId = document.getElementById("prop-id").value;
const isAuth = document.getElementById("is-auth").value;
const isOwn = document.getElementById("is-own").value;
const close = document.querySelector(".close")
const myModel = document.getElementById("myModel");
const favoritBtn = document.querySelector(".favorite");
const commentBtn = document.querySelector(".comment");
const shareBtn = document.querySelector(".send");
const bookmarkBtn = document.querySelector(".bookmark");
const question = document.getElementById("question");
const quesSubmitBtn = document.getElementById("question-submit-btn");


console.log(isOwn);
var bookmark = false;
var like = false;
const shareData = {
    title: 'NESTSCOUT',
    text: "recommendadion of property from NESTSCOUT",
    url: host + "/property/" + propertyId,
}
console.log(propertyId);

function openModal() {
    close.style.display = "unset";
    myModel.classList.remove("slideshow-container")
    myModel.classList.add("modal");
}

function closeModal() {
    close.style.display = "none";
    myModel.classList.remove("modal")
    myModel.classList.add("slideshow-container");
}

showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = parseInt(n));
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}


if (isAuth == "true") {
    // bookmark btn

    fetch(host + "/property/bookmark/" + propertyId, {
            method: 'GET'
        })
        .then(result => result.json())
        .then(result => {
            if (result.bookmark) {
                bookmarkBtn.style.color = "#E8AA42";
            }
            bookmark = result.bookmark;

        })
        .catch(err => console.log(err));

    bookmarkBtn.addEventListener("click", () => {
        console.log("bookmark " + propertyId);
        fetch(host + "/property/bookmark/" + propertyId, {
                method: 'POST',
                body: new URLSearchParams("bookmark=" + bookmark),
            })
            .then(result => result.json())
            .then(result => {
                if (result.bookmark) {
                    bookmarkBtn.style.color = "#E8AA42";
                } else {
                    bookmarkBtn.style.color = "inherit";
                }
                bookmark = result.bookmark;
            })
            .catch(err => console.log(err));
    });

    // like btn

    fetch(host + "/property/like/" + propertyId, {
            method: 'GET'
        })
        .then(result => result.json())
        .then(result => {
            if (result.like) {
                favoritBtn.style.color = "#E8AA42";
            }
            like = result.like;

        })
        .catch(err => console.log(err));


    favoritBtn.addEventListener("click", () => {
        console.log("like " + propertyId);
        fetch(host + "/property/like/" + propertyId, {
                method: 'POST',
                body: new URLSearchParams("like=" + like),
            })
            .then(result => result.json())
            .then(result => {
                if (result.like) {
                    favoritBtn.style.color = "#E8AA42";
                } else {
                    favoritBtn.style.color = "inherit";
                }
                like = result.like;
            })
            .catch(err => console.log(err));
    });
}
// share btn

shareBtn.addEventListener("click", () => {
    console.log("share " + propertyId);
    navigator.share(shareData)
});

//  question submit

quesSubmitBtn.addEventListener("click", () => {
    if (question.value) {
        fetch(host + "/property/ask-question", {
                method: "POST",
                body: new URLSearchParams("propId=" +
                    propertyId +
                    "&question=" + question.value)
            })
            .then(result => result.json())
            .then(result => {

                const div = document.createElement('div');
                div.classList.add("q-a-container");
                div.classList.add("value");
                div.innerHTML = `<div class="user">
                                    <a href="/profile/">
                                        <img src="` + result.user.url + `" alt="">
                                        <h6>` + result.user.name + `</h6>
                                    </a>
                                </div>
                                <div class="q-a">
                                    <div class="question">
                                        <h4><span><strong>Q.</strong> </span>` + result.question + `
                                        </h4>
                                    </div>
                                    <div class="Answer">
                                        <h5><span><strong>A.</strong>
                                            </span>waiting for the answer</h5>
                                    </div>
                                </div>`;
                document.getElementById("que").insertAdjacentElement("beforebegin", div);
                question.value = "";
                console.log(result.message);
            })
            .catch(err => console.log(err));
    }

})