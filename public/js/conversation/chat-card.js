const chatCard = (text, timeStamp, sender, marker) => {
    const chat = `
                    <div class="chat">` + text + `
                    </div>
                    <div class="chat-footer">
                        <span class="time-stamp">` + formatAMPM(timeStamp) + `</span>
                        &emsp;
                        <span></span>
                    </div>
    `;
    const div = document.createElement('div');
    div.classList.add('chat-box')
    div.classList.add(sender ? 'sended' : 'recived');
    div.innerHTML = chat;
    return div;
}




function formatAMPM(date) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function visitCard(message, property, isAuth, isVisiter) {

    const div = document.createElement('div');
    div.id = property._id;
    div.classList.add("card");



    // header
    const header = document.createElement('div');
    header.classList.add("header");

    const detail = document.createElement('div');
    detail.classList.add("detail");

    const line1 = document.createElement('div');
    line1.classList.add("line1");

    const title = document.createElement('h3');
    title.classList.add("title");
    title.appendChild(document.createTextNode(property.basicDetail.noOfBhkOrRk + ' ' + property.basicDetail.bhkOrRk + ' ' + property.basicDetail.propertyType));

    const price = document.createElement('h3');
    price.classList.add("price");
    price.appendChild(document.createTextNode("₹ " + property.priceArea.price.$numberDecimal))

    const line2 = document.createElement('div');
    line2.classList.add("line2");

    const area = document.createElement('h4');
    area.classList.add("area");
    area.appendChild(document.createTextNode(property.priceArea.coveredArea.$numberDecimal + " Sq-Ft"))

    const location = document.createElement('h5');
    location.classList.add("location");

    const materialSymbolsOutlined = document.createElement('span');
    materialSymbolsOutlined.classList.add("material-symbols-outlined");
    materialSymbolsOutlined.appendChild(document.createTextNode("pin_drop"));

    location.appendChild(materialSymbolsOutlined);
    location.appendChild(document.createTextNode(property.basicDetail.city + ", " + property.basicDetail.state))

    line1.appendChild(title);
    line1.appendChild(price);

    line2.appendChild(area);
    line2.appendChild(location);

    detail.appendChild(line1);
    detail.appendChild(line2);

    header.appendChild(detail);
    header.appendChild(document.createTextNode("    "));


    // body
    const body = document.createElement('div');
    body.classList.add("body");

    const a = document.createElement('a');
    a.href = ("/property/" + property._id);

    const bodyImage = document.createElement('img');
    bodyImage.classList.add("body-image");
    bodyImage.src = property.photos[0].imageUrl;
    bodyImage.alt = "image not loadded";


    const actionType = document.createElement('h3');
    actionType.classList.add("action-type");
    actionType.appendChild(document.createTextNode(property.actionType));


    a.appendChild(bodyImage)
    a.appendChild(actionType)
    body.appendChild(a);

    div.appendChild(header);
    div.appendChild(body);
    const status = message.message.camVisit.status;

    if (isVisiter && (status == 'requested' || status == 'scheduled' || status == 'started' || status == 'ended')) {
        const ownBtns = document.createElement('div');
        ownBtns.classList.add("ownBtns");
        const canVBtn = document.createElement('button');
        canVBtn.classList.add("ownBtn");
        canVBtn.classList.add("btn1");
        canVBtn.appendChild(document.createTextNode(status != 'scheduled' ? (status == 'started' ? "join visit" : status) : 'scheduled on ' + (new Date(message.message.camVisit.shaduleDate)).toLocaleDateString('en-GB', {
            timeZone: 'UTC'
        }) + ", " + (new Date(message.message.camVisit.shaduleDate)).toLocaleTimeString('en-GB', {
            timeZone: 'UTC'
        })));

        if (status == 'started') {
            canVBtn.addEventListener("click", () => {
                console.log('joined cam visit');
            })

        }
        ownBtns.appendChild(canVBtn);
        div.appendChild(ownBtns);
    } else if (status == 'requested' || status == 'scheduled') {

        const ownBtns = document.createElement('div');
        ownBtns.classList.add("ownBtns");

        const shedualPicker = document.createElement('input');
        shedualPicker.type = "datetime-local";
        var currentDate = message.message.camVisit.shaduleDate ? new Date(message.message.camVisit.shaduleDate) : new Date();
        shedualPicker.value = currentDate.toISOString().slice(0, 16);
        shedualPicker.min = currentDate.toISOString().slice(0, 16);
        shedualPicker.style.width = '150%';
        shedualPicker.classList.add("ownBtn");
        shedualPicker.classList.add("btn1");
        ownBtns.appendChild(shedualPicker);

        const shedualBtn = document.createElement('button');
        shedualBtn.classList.add("ownBtn");
        shedualBtn.classList.add("btn2");
        shedualBtn.appendChild(document.createTextNode(status == 'requested' ? 'schedule' : 'reschedule'));
        ownBtns.appendChild(shedualBtn);
        div.appendChild(ownBtns);
        shedualBtn.addEventListener("click", () => {
            fetch(host + '/conversations/shedual-cam-visit/', {
                    method: 'POST',
                    body: new URLSearchParams("visiter=" + message.message.camVisit.visiter + "&messId=" + message._id + "&shaduleDate=" + shedualPicker.value)
                })
                .then(response => {
                    return response.json();
                })
                .then(result => {
                    console.log(result);
                    if (result.statusCode == 404) {
                        alert(result.message)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        })
    } else if (status == 'started' || status == 'ended') {
        const ownBtns = document.createElement('div');
        ownBtns.classList.add("ownBtns");
        const canVBtn = document.createElement('button');
        canVBtn.classList.add("ownBtn");
        canVBtn.classList.add("btn1");
        canVBtn.appendChild(document.createTextNode(status == 'started' ? "join visit" : status));
        if (status == 'started') {
            canVBtn.addEventListener("click", () => {
                console.log('joined cam visit');
                window.location.href = host + "/conversations/visit-box/" + message._id;
            })

        }
        ownBtns.appendChild(canVBtn);
        div.appendChild(ownBtns);
    }

    return div;
}