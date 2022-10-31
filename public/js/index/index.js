const host = location.protocol + '//' + location.host;
const main = document.querySelector("main")
var pageNo = 1;

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
                const pC = propertyCard(result.propertys[0], result.isAuth, () => {})
                main.appendChild(pC);
                pC.style.animation = "scale-display .3s";
                if (result.totalPage > pageNo) {
                    pageNo++;
                    addProperty();
                }
            } else {
                alert(result.message);
            }

        })
        .catch(err => {
            console.log(err);
        })
}