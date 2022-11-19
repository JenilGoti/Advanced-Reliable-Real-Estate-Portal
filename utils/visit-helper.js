const {
    isUuid
} = require('uuidv4');

exports.cuntrollVisit =(socket)=>{
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId);
        console.log(isUuid(roomId))
        if (isUuid(roomId)) {
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
        }
        socket.on('disconnect', () => {
            console.log("disconnected:");
            socket.to(roomId).emit('user-disconnected', userId)
        });
    });
    socket.on('disconnect', () => {
        console.log("disconnected:");
    });
}