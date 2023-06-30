const main = document.querySelector("main");
var element = document.querySelector('.loader');
var pageNo = 1;
var lodPageAtTime = 20;
var upperVal=10000000000;
var lowerVal=0;

getProperty()

function getProperty() {
    fetch(host + '/property/?page=' + pageNo + '&sale=true'+'&upperVal='+upperVal+'&lowerVal='+lowerVal, {
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


// filter slider

var lowerSlider = document.querySelector('#lower');
var  upperSlider = document.querySelector('#upper');

document.querySelector('#two').value=upperSlider.value;
document.querySelector('#one').value=lowerSlider.value;

lowerVal = parseInt(lowerSlider.value);
upperVal = parseInt(upperSlider.value);

upperSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    if (upperVal < lowerVal + 4) {
        lowerSlider.value = upperVal - 4;
        if (lowerVal == lowerSlider.min) {
        upperSlider.value = 4;
        }
    }
    document.querySelector('#two').value=this.value
};

lowerSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);
    if (lowerVal > upperVal - 4) {
        upperSlider.value = lowerVal + 4;
        if (upperVal == upperSlider.max) {
            lowerSlider.value = parseInt(upperSlider.max) - 4;
        }
    }
    document.querySelector('#one').value=this.value
};

document.querySelector('#two').onchange = function(){
    upperSlider.value=parseInt(document.querySelector('#two').value);
    upperVal=upperSlider.value
};

document.querySelector('#one').onchange = function(){
    lowerSlider.value=parseInt(document.querySelector('#one').value);
    lowerVal=lowerSlider.value
};


// filter button
function filter(params) {
    main.innerHTML="";
    pageNo = 1;
    getProperty();
}
