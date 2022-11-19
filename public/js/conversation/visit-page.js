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


// let supports = navigator.mediaDevices.getSupportedConstraints();
// if (supports['facingMode'] === true) {
//     flipBtn.disabled = false;
// }
let defaultsOpts = {
    audio: false,
    video: true
}
let shouldFaceUser = true; //Default is the front cam

// defaultsOpts.video = {
//     facingMode: shouldFaceUser ? 'user' : 'environment'
// }

let stream = null;

// function capture() {
//   defaultsOpts.video = { facingMode: shouldFaceUser ? 'user' : 'environment' }
//   navigator.mediaDevices.getUserMedia(defaultsOpts)
//     .then(function(_stream) {
//       stream  = _stream;
//       videoElm.srcObject = stream;
//       videoElm.play();
//     })
//     .catch(function(err) {
//       console.log(err)
//     });
// }

// flipBtn.addEventListener('click', function(){
//   if( stream == null ) return
//   // we need to flip, stop everything
//   stream.getTracks().forEach(t => {
//     t.stop();
//   });
//   // toggle / flip
//   shouldFaceUser = !shouldFaceUser;
//   capture();
// })

// capture();

navigator.mediaDevices.getUserMedia(defaultsOpts).then(stream => {
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