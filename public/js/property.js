function propertyCard(property, isAuth, imageEventListner) {
    const div = document.createElement('div');
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

    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.classList.add("bookmark-btn");

    const materialSymbolsOutlined2 = document.createElement('span');
    materialSymbolsOutlined2.classList.add("material-symbols-outlined");
    materialSymbolsOutlined2.appendChild(document.createTextNode("bookmark"));

    bookmarkBtn.appendChild(materialSymbolsOutlined2);

    line1.appendChild(title);
    line1.appendChild(price);

    line2.appendChild(area);
    line2.appendChild(location);

    detail.appendChild(line1);
    detail.appendChild(line2);

    header.appendChild(detail);
    header.appendChild(document.createTextNode("    "));
    if (isAuth) {
        header.appendChild(bookmarkBtn)
    }


    // body
    const body = document.createElement('div');
    body.classList.add("body");

    const a = document.createElement('a');
    a.href = ("/property/" + property._id);

    const bodyImage = document.createElement('img');
    bodyImage.classList.add("body-image");
    bodyImage.src = property.photos[0].imageUrl;
    bodyImage.alt = "image not loadded";
    bodyImage.addEventListener("load", imageEventListner);

    a.appendChild(bodyImage)
    body.appendChild(a);

    // footer
    const footer = document.createElement('div');
    footer.classList.add("footer");

    const a2 = document.createElement('a');
    a2.href = ("/profile/" + property.userId._id);

    const userImage = document.createElement('img');
    userImage.classList.add("user-image");
    userImage.src = property.userId.user_thumbnail.small;
    userImage.alt = "image not loadded";

    const userName = document.createElement('h4');
    userName.classList.add("user-name");
    userName.appendChild(document.createTextNode(property.userId.firstName + " " + property.userId.lastName))

    const btns = document.createElement('div');
    btns.classList.add("btns");

    const favoritBtn = document.createElement('button');
    favoritBtn.classList.add("favorit-btn");

    const materialSymbolsOutlined3 = document.createElement('span');
    materialSymbolsOutlined3.classList.add("material-symbols-outlined");
    materialSymbolsOutlined3.appendChild(document.createTextNode("favorite"));
    favoritBtn.appendChild(materialSymbolsOutlined3);

    const commentBtn = document.createElement('a');
    commentBtn.href = "/comment/" + property._id;
    commentBtn.classList.add("comment-btn");

    const materialSymbolsOutlined4 = document.createElement('span');
    materialSymbolsOutlined4.classList.add("material-symbols-outlined");
    materialSymbolsOutlined4.appendChild(document.createTextNode("comment"));
    commentBtn.appendChild(materialSymbolsOutlined4)

    const shareBtn = document.createElement('button');
    shareBtn.classList.add("share-btn");

    const materialSymbolsOutlined5 = document.createElement('span');
    materialSymbolsOutlined5.classList.add("material-symbols-outlined");
    materialSymbolsOutlined5.appendChild(document.createTextNode("send"));
    shareBtn.appendChild(materialSymbolsOutlined5);

    a2.appendChild(userImage);
    a2.appendChild(userName);

    btns.appendChild(favoritBtn);
    btns.appendChild(commentBtn);
    btns.appendChild(shareBtn);

    footer.appendChild(a2);
    if (isAuth) {
        footer.appendChild(btns);
    }

    div.appendChild(header);
    div.appendChild(body);
    div.appendChild(footer);

    bookmarkBtn.addEventListener("click", () => {

        console.log("bookmark "+property._id);
    }
    );
    favoritBtn.addEventListener("click", () => {
        console.log("like "+property._id);
    });
    shareBtn.addEventListener("click", () => {
        console.log("share "+property._id);
    });

    return div;
}