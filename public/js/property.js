function propertyCard(property, isAuth, imageEventListner, isOwn = false) {
    var bookmark = false;
    var like = false;
    const shareData = {
        title: 'NESTSCOUT',
        text: property.basicDetail.noOfBhkOrRk + ' ' +
            property.basicDetail.bhkOrRk + ' ' +
            property.basicDetail.propertyType + ' at ' +
            property.basicDetail.city + ", " +
            property.basicDetail.state + " avilable at NESTSCOUT \n",
        url: host + "/property/" + property._id,
    }



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


    const actionType = document.createElement('h3');
    actionType.classList.add("action-type");
    actionType.appendChild(document.createTextNode(property.actionType));


    a.appendChild(bodyImage)
    a.appendChild(actionType)
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
    if (isAuth) {
        // bookmark btn

        fetch(host + "/property/bookmark/" + property._id, {
                method: 'GET'
            })
            .then(result => result.json())
            .then(result => {
                if (result.bookmark) {
                    bookmarkBtn.style.color = "var(--bc1)";
                }
                bookmark = result.bookmark;

            })
            .catch(err => console.log(err));

        bookmarkBtn.addEventListener("click", () => {
            fetch(host + "/property/bookmark/" + property._id, {
                    method: 'POST',
                    body: new URLSearchParams("bookmark=" + bookmark),
                })
                .then(result => result.json())
                .then(result => {
                    if (result.bookmark) {
                        bookmarkBtn.style.color = "var(--bc1)";
                    } else {
                        bookmarkBtn.style.color = "inherit";
                    }
                    bookmark = result.bookmark;
                })
                .catch(err => console.log(err));
        });

        // like btn

        fetch(host + "/property/like/" + property._id, {
                method: 'GET'
            })
            .then(result => result.json())
            .then(result => {
                if (result.like) {
                    favoritBtn.style.color = "var(--bc1)";
                }
                like = result.like;

            })
            .catch(err => console.log(err));


        favoritBtn.addEventListener("click", () => {
            fetch(host + "/property/like/" + property._id, {
                    method: 'POST',
                    body: new URLSearchParams("like=" + like),
                })
                .then(result => result.json())
                .then(result => {
                    if (result.like) {
                        favoritBtn.style.color = "var(--bc1)";
                    } else {
                        favoritBtn.style.color = "inherit";
                    }
                    like = result.like;
                })
                .catch(err => console.log(err));
        });
    }
    // share btn

    shareBtn.addEventListener("click", () => {
        navigator.share(shareData)
    });

    if (isOwn) {
        const ownBtns = document.createElement('div');
        ownBtns.classList.add("ownBtns");
        const editBtn = document.createElement('button');
        editBtn.classList.add("ownBtn");
        editBtn.classList.add("btn1");
        editBtn.type="reset"
        editBtn.appendChild(document.createTextNode("EDIT"))
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add("ownBtn");
        deleteBtn.classList.add("btn1");
        deleteBtn.appendChild(document.createTextNode("DELETE"))
        ownBtns.appendChild(editBtn);
        ownBtns.appendChild(deleteBtn);
        div.appendChild(ownBtns);


        // delete btn
        deleteBtn.addEventListener("click", () => {
            fetch(host + "/admin/delete-property", {
                    method: 'DELETE',
                    body: new URLSearchParams("propId=" + property._id),
                })
                .then(result => result.json())
                .then(result => {
                    if (result.statusCode == 200) {
                        div.remove();
                    } else {
                        alert(result.message)
                    }
                })
                .catch(err => {
                    alert("property is not deleted")
                    console.log(err)
                });
        });

        // edit btn
        editBtn.addEventListener("click",()=>{
            console.log(host+"/edit-property/"+property._id);
            window.location.href=host+"/admin/edit-property/"+property._id;
        })
    }

    return div;
}