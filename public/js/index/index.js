const host = location.protocol + '//' + location.host;
const main = document.querySelector("main");
var pageNo = 1;
var lodPageAtTime = 20;
var loadPage = 20;
var hasNext = true;
var totalPage = 999999;
var lodderOnScreen = false;

addProperty()

function addProperty() {
    fetch(host + '/property/' + pageNo, {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(result => {

            if (result.statusCode == 200) {
                console.log(result);
                hasNext = result.hasNext;
                const pC = propertyCard(result.propertys[0], result.isAuth, () => {})
                main.appendChild(pC);
                pC.style.animation = "scale-display .3s";
                if (result.totalPage > pageNo && loadPage > pageNo) {
                    pageNo++;
                    addProperty();
                    lodderOnScreen = false;
                    if ((pageNo) % lodPageAtTime == 0) {
                        // element.style.display = "unset";
                        window.addEventListener('scroll', getNext);
                    }

                }

            } else {
                alert(result.message);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function getNext() {
    var element = document.querySelector('.loader');
    var position = element.getBoundingClientRect();
    if (position.bottom <= window.innerHeight) {
        if (!lodderOnScreen) {
            if (hasNext && totalPage > pageNo) {
                loadPage = loadPage + lodPageAtTime;
                pageNo++;
                addProperty();

            } else if (!hasNext) {
                // element.style.display = "none";
                element.remove();
            }
            lodderOnScreen = true;
            window.removeEventListener('scroll', getNext);
        }
        console.log(pageNo, loadPage);
    }
}