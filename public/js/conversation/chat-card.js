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

function visitCard(camVisitMessage, property, isAuth, isOwner) {

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

    if (!isOwner) {
        const ownBtns = document.createElement('div');
        ownBtns.classList.add("ownBtns");
        const canVBtn = document.createElement('button');
        canVBtn.classList.add("ownBtn");
        canVBtn.classList.add("btn1");
        canVBtn.appendChild(document.createTextNode(camVisitMessage.status));
        ownBtns.appendChild(canVBtn);
        div.appendChild(ownBtns);
        canVBtn.addEventListener("click", () => {
            console.log("request for cam visit");
        })
    } else {
        const ownBtns = document.createElement('div');
        ownBtns.classList.add("ownBtns");

        const shedualPicker = document.createElement('input');
        shedualPicker.type = "datetime-local";
        var currentDate = new Date();
        shedualPicker.value = currentDate.toISOString().slice(0, 16);
        shedualPicker.min = currentDate.toISOString().slice(0, 16);
        shedualPicker.style.width = '150%';
        shedualPicker.classList.add("ownBtn");
        shedualPicker.classList.add("btn1");
        ownBtns.appendChild(shedualPicker);

        const shedualBtn = document.createElement('button');
        shedualBtn.classList.add("ownBtn");
        shedualBtn.classList.add("btn2");
        shedualBtn.appendChild(document.createTextNode('schedule'));
        ownBtns.appendChild(shedualBtn);
        div.appendChild(ownBtns);
        shedualBtn.addEventListener("click", () => {
            console.log("request for cam visit");
        })
    }

    return div;
}