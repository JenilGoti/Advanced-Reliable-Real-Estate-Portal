let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const onOffVidBtn = document.getElementById("video-ctr");
const onOffAudBtn = document.getElementById("audio-ctr");
const switchCamBtn = document.getElementById("switch-cam");
const fullScreenBtn = document.getElementById("fullscreen");


const myVideo = document.createElement("video");
myVideo.classList.add("my-video");
const video = document.createElement('video');
video.classList.add("others-video");
myVideo.muted = true;
var _stream = null;
var _anotherStream = null;
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

var isVidOn = true;
var isAudOn = true;
var isFullScreen = false;

const peer = new Peer(undefined, option);

let supports = navigator.mediaDevices.getSupportedConstraints();
if (supports['facingMode'] != true) {
    alert('not a facing mode')
}
let shouldFaceUser = true;

//open peer
peer.on("open", (id) => {
    console.log(id);
    socket.emit("join-room", ROOM_ID, id);
});

// soket listning

socket.on('user-disconnected', (userId) => {
    console.log("disconnected =" + userId);
    alert("Call disconnected, if connection loss then waiting for reconnect or go to home screen")
    peers[userId].close();
})

socket.on('user-updated', (userId) => {
    console.log('update');
    peer.disconnect();
    peer.reconnect();
})

// streaming start

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


function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    call.on('stream', userVideoStream => {
        _anotherStream = userVideoStream;
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
            peer.disconnect();
            peer.reconnect();
            socket.emit('update');
        });

    }
}

switchAudio = () => {
    onOffAudBtn.style.backgroundColor = isAudOn ? 'var(--c1)' : 'var(--bc1)';
    _stream.getAudioTracks().forEach(track => {
        isAudOn = !track.enabled;
        return track.enabled = !track.enabled;
    });
}


switchVideo = () => {
    onOffVidBtn.style.backgroundColor = isVidOn ? 'var(--c1)' : 'var(--bc1)';
    _stream.getVideoTracks().forEach(track => {
        isVidOn = !track.enabled;
        return track.enabled = !track.enabled;
    });
};

fullScreenTgl = () => {
    isFullScreen = !isFullScreen;
    fullScreenBtn.innerHTML = isFullScreen ?
        `<span class="material-symbols-outlined">
        fullscreen_exit
        </span>` :
        `<span class="material-symbols-outlined">
        fullscreen
        </span>`;
    let doc = document,
        elm = videoGrid;
    if (elm.requestFullscreen) {
        (!doc.fullscreenElement ? elm.requestFullscreen() : doc.exitFullscreen())
    } else if (elm.mozRequestFullScreen) {
        (!doc.mozFullScreen ? elm.mozRequestFullScreen() : doc.mozCancelFullScreen())
    } else if (elm.msRequestFullscreen) {
        (!doc.msFullscreenElement ? elm.msRequestFullscreen() : doc.msExitFullscreen())
    } else if (elm.webkitRequestFullscreen) {
        (!doc.webkitIsFullscreen ? elm.webkitRequestFullscreen() : doc.webkitCancelFullscreen())
    } else {
        console.log("Fullscreen support not detected.");
    }
}

switchCamBtn.addEventListener('click', switchCemera);
onOffAudBtn.addEventListener('click', switchAudio);
onOffVidBtn.addEventListener('click', switchVideo);
fullScreenBtn.addEventListener('click', fullScreenTgl);