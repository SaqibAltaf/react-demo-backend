var io = require('./../app').io;

module.exports = function (socket) {
    console.log("connect")
    socket.on('connect', () => {
        console.log("client connected")
    })

    
io.emit('join', "hfladsflkjdslk")


    socket.on('disconnect', () => {
        console.log("client disconnected")
    })
}
