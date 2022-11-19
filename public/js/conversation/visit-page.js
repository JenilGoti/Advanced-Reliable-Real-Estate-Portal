let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.id = "my-video";
const video = document.createElement('video');
video.id = "others-video";
myVideo.muted = true;
const peers = {};

option = PORT == '3000' ? {
    host: '/',
    port: PORT,
    path: '/peerjs'
} : {
    secure: true,
    host: '0.peerjs.com',
    port: '443'
};

const peer = new Peer(undefined, option);


// const supports = navigator.mediaDevices.getSupportedConstraints();
// if (!supports['facingMode']) {
//     alert('This browser does not support facingMode!');
// }
// console.log(supports)
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment'// Or 'user' 
    },
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);

        }, err => {
            console.log(err);
        })
    })
    socket.on('user-connected', (userId) => {
        setTimeout(connectToNewUser, 1000, userId, stream)
    })
})

socket.on('user-disconnected', (userId) => {
    console.log("disconnected =" + userId);
    peers[userId].close();
})


peer.on("open", (id) => {
    console.log(id);
    socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    }, err => {
        console.log(err);
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call;
}


function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}