const main = document.querySelector("main");
var element = document.querySelector('.loader');
var pageNo = 1;
var lodPageAtTime = 20;

getProperty()

function getProperty() {
    fetch(host + '/property/?page=' + pageNo + '&sale=true', {
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
            } else {
                alert(result.message);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

sevl = () => {
    var position = element.getBoundingClientRect();
    if (position.bottom <= window.innerHeight) {
        getProperty();
        window.removeEventListener('scroll', sevl);
        console.log(pageNo);
    }
}