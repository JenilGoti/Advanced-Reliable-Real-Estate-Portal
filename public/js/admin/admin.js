const Id = document.getElementById("uId").value;
const userProp = document.querySelector(".userProp");

const link = window.location.href;
const shareData = {
    title: 'NESTSCOUT',
    text: "User Profile from NESTSCOUT\n",
    url: link,
}

share = () => {
    navigator.share(shareData);
}

var element = document.querySelector('.loader');
var pageNo = 1;
var lodPageAtTime = 20;

var upperVal=10000000000;
var lowerVal=0;
getProperty()

function getProperty() {
    fetch(host + '/property/?page=' + pageNo + '&userId=' + Id+'&upperVal='+upperVal+'&lowerVal='+lowerVal, {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            if (result.statusCode == 200) {
                console.log(result);
                hasNext = result.hasNext;
                const pC = propertyCard(result.propertys[0], result.isAuth, () => {},true);
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
                userProp.appendChild(pC);
                pC.style.animation = "scale-display .3s";
            } else {
                h1=document.createElement("h1");
                h1.appendChild(document.createTextNode("no property found"))
                userProp.appendChild(h1);
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