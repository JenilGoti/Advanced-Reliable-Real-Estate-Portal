const main = document.querySelector("main");
var element = document.querySelector('.loader');
var pageNo = 1;
var lodPageAtTime = 20;

getProperty()

function getProperty() {
    fetch(host + '/property/?page=' + pageNo + "&bookmark=true", {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(result => {

            if (result.statusCode == 200) {
                console.log(result);
                hasNext = result.hasNext;
                const pC = propertyCard(result.propertys[0], result.isAuth, () => {});
                if (result.totalPage > pageNo) {
                    pageNo++;
                    if ((pageNo + 1) % lodPageAtTime == 0) {
                        element.style.display = "unset";
                        window.addEventListener('scroll', sevl);
                    } else {
                        getProperty();
                    }
                } else {
                    element.remove();
                }
                main.appendChild(pC);
                pC.style.animation = "scale-display .3s";
            } else if (result.totalPage) {
                if (result.totalPage > pageNo) {
                    pageNo++;
                    if ((pageNo + 1) % lodPageAtTime == 0) {
                        element.style.display = "unset";
                        window.addEventListener('scroll', sevl);
                    } else {
                        getProperty();
                    }
                } else {
                    element.remove();
                }
            } else {
                h1 = document.createElement("h1");
                h1.appendChild(document.createTextNode("no bookmarks found"))
                main.appendChild(h1);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

sevl = () => {
    var position = element.getBoundingClientRect();
    if (position.bottom <= window.innerHeight) {
        addProperty();
        window.removeEventListener('scroll', sevl);
        console.log(pageNo);
    }
}