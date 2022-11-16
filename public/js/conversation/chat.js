const user1 = document.getElementById("user1").value;
const user2 = document.getElementById("user2").value;

var element = document.querySelector('.loader');
const main = document.querySelector("#chats");
const main1 = document.querySelector(".chats");
var mNo = 1;
var lodMessageAtTime = 20;


getMessage();

function getMessage() {
    fetch(host + '/conversations/messages/?mNum=' + mNo + '&user1=' + user1 + '&user2=' + user2, {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            if (result.statusCode == 200) {
                console.log(result);
                hasNext = result.hasNext;
                // if (result.mess.message.property) {
                //     fetch(host + '/property/?page=1&propId=' + message.message.property, {
                //             method: 'GET',
                //         })
                //         .then(response => {
                //             return response.json();
                //         })
                //         .then(result => {
                //             if (result.statusCode == 200) {
                //                 console.log(result);
                //                 const pC = propertyCard(result.propertys[0], result.isAuth, () => {}, false, (message.sender.toString() == user1.toString()));
                //                 pC.classList.add(message.sender.toString() == user1.toString() ? 'sended' : 'recived')
                //                 main.appendChild(pC);
                //                 pC.style.animation = "scale-display .3s";
                //             }
                //         })
                //         .catch(err => {
                //             console.log(err);
                //             const mC = chatCard(result.mess.message.text, message.createdAt, message.sender.toString() == user1.toString(), message.read)
                //             main.appendChild(mC);
                //             mC.style.animation = "scale-display .3s";
                //         })
                // } else {
                //     const mC = chatCard(result.mess.message.text, message.createdAt, message.sender.toString() == user1.toString(), message.read)
                //     main.appendChild(mC);
                //     mC.style.animation = "scale-display .3s";
                // }
                message(result.mess, true);
                if (result.totalMessage > mNo) {
                    mNo++;
                    if ((mNo + 1) % lodMessageAtTime == 0) {
                        element.style.display = "unset";
                        main1.addEventListener('scroll', sevl);
                    } else {
                        getMessage();
                    }
                } else {
                    element.remove();
                }
            } else {
                h1 = document.createElement("h1");
                h1.appendChild(document.createTextNode("no property found"))
                main.appendChild(h1);
                alert(result.message);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

sevl = () => {
    var position = element.getBoundingClientRect();
    console.log(position);
    if (position.top > 0) {
        getMessage();
        main1.removeEventListener('scroll', sevl);
        console.log(mNo);
    }
}


sendMessage = () => {
    const message = document.getElementById("send-chat").value;
    document.getElementById("send-chat").value = '';
    if (message) {
        fetch(host + '/conversations/message/', {
                method: 'POST',
                body: new URLSearchParams("text=" + message + "&userId=" + user2)
            })
            .then(response => {
                return response.json();
            })
            .then(result => {
                if (result.statusCode == 200) {
                    console.log(result);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}

socket.on("new_msg", function (data) {
    console.log(data);
    if ((data.msg.users[0].user.toString() == user1 || data.msg.users[0].user.toString() == user2) && (data.msg.users[0].user.toString() == user1 || data.msg.users[0].user.toString() == user2)) {
        mNo++;
        message(data.msg, false)
    }
})

const message = (message, top) => {

    if (message.message.property) {
        fetch(host + '/property/?page=1&propId=' + message.message.property, {
                method: 'GET',
            })
            .then(response => {
                return response.json();
            })
            .then(result => {
                if (result.statusCode == 200) {
                    console.log(result);
                    const mC = propertyCard(result.propertys[0], result.isAuth, () => {}, false, (message.sender.toString() == user1.toString()));
                    mC.classList.add(message.sender.toString() == user1.toString() ? 'sended' : 'recived');
                    if (top) {
                        mC.id = message._id;
                        main.appendChild(mC);
                        mC.style.animation = "scale-display .3s";
                    } else {
                        mC.id = message._id;
                        main.prepend(mC);
                        mC.style.animation = "scale-display .3s";
                    }

                }
            })
            .catch(err => {
                console.log(err);
                const mC = chatCard(message.message.text, message.createdAt, message.sender.toString() == user1.toString(), message.read);
                if (top) {
                    mC.id = message._id;
                    main.appendChild(mC);
                    mC.style.animation = "scale-display .3s";
                } else {
                    mC.id = message._id;
                    main.prepend(mC);
                    mC.style.animation = "scale-display .3s";
                }

            })
    } else if (message.message.camVisit) {
        fetch(host + '/property/?page=1&propId=' + message.message.camVisit.property, {
                method: 'GET',
            })
            .then(response => {
                return response.json();
            })
            .then(result => {
                if (result.statusCode == 200) {
                    console.log(result);
                    const mC = visitCard(message, result.propertys[0], result.isAuth, (message.message.camVisit.visiter.toString() == user1.toString()));
                    mC.classList.add(message.sender.toString() == user1.toString() ? 'sended' : 'recived');
                    if (top) {
                        mC.id = message._id;
                        main.appendChild(mC);
                        mC.style.animation = "scale-display .3s";
                    } else {
                        mC.id = message._id;
                        main.prepend(mC);
                        mC.style.animation = "scale-display .3s";
                    }
                }
            })
            .catch(err => {
                console.log(err);
                const mC = chatCard(message.message.text, message.createdAt, message.sender.toString() == user1.toString(), message.read);
                if (top) {
                    mC.id = message._id;
                    main.appendChild(mC);
                    mC.style.animation = "scale-display .3s";
                } else {
                    mC.id = message._id;
                    main.prepend(mC);
                    mC.style.animation = "scale-display .3s";
                }

            })
        console.log(message.message.camVisit);
    } else {
        const mC = chatCard(message.message.text, message.createdAt, message.sender.toString() == user1.toString(), message.read);
        if (top) {
            mC.id = message._id;
            main.appendChild(mC);
            mC.style.animation = "scale-display .3s";
        } else {
            mC.id = message._id;
            main.prepend(mC);
            mC.style.animation = "scale-display .3s";
        }
    }

}