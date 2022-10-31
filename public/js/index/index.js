const host = location.protocol + '//' + location.host;
const main = document.querySelector("main");
var element = document.querySelector('.loader');
var pageNo = 1;
var lodPageAtTime = 20;

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
                const pC = propertyCard(result.propertys[0], result.isAuth, () => {
                    if (result.totalPage > pageNo) {
                        pageNo++;
                        if ((pageNo+1) % lodPageAtTime == 0) {
                            element.style.display = "unset";
                            evl=() =>{
                                var position = element.getBoundingClientRect();
                                if (position.bottom <= window.innerHeight) {
                                    addProperty();
                                    window.removeEventListener('scroll', evl);
                                    console.log(pageNo);
                                }
                            }
                            window.addEventListener('scroll', evl);
                        }
                        else{
                            addProperty();
                        }
                    }
                    else{
                        element.remove();
                    }
                })
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