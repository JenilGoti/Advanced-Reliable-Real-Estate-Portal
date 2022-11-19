let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const switchCamBtn = document.getElementById("switch-cam");


const myVideo = document.createElement("video");
myVideo.id = "my-video";
const video = document.createElement('video');
video.id = "others-video";
myVideo.muted = true;
var _stream = null;
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

let supports = navigator.mediaDevices.getSupportedConstraints();
if (supports['facingMode'] != true) {
    // flipBtn.disabled = false;
    alert('not a facing mode')
}
let shouldFaceUser = true;
//open peer

peer.on("open", (id) => {
    console.log(id);
    socket.emit("join-room", ROOM_ID, id);
});



navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
        facingMode: shouldFaceUser ? 'user' : 'environment'
    }
}).then(stream => {
    _stream = stream;
    addVideoStream(myVideo, _stream);
    peer.on('call', call => {
        call.answer(_stream);
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

const switchCemera = () => {
    if (_stream != null) {
        if (_stream) {
            const tracks = _stream.getTracks();
            tracks.forEach(track => track.stop());
          }
        shouldFaceUser = shouldFaceUser == true ? false : true;
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
                facingMode: shouldFaceUser ? 'user' : 'environment'
            }
        }).then(stream => {
            _stream = stream;
            addVideoStream(myVideo, _stream);
            peer.on('call', call => {
                call.answer(_stream);
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream);
        
                }, err => {
                    console.log(err);
                })
            })
            socket.on('user-connected', (userId) => {
                setTimeout(connectToNewUser, 1000, userId, stream)
            })
            console.log('stream chenged', shouldFaceUser);
        });

    }
}


switchCamBtn.addEventListener('click', switchCemera);