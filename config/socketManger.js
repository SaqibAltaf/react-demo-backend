var io = require('./../app').io;

module.exports = function (socket) {
    console.log("connect")
    socket.on('connect', () => {
        console.log("client connected")
    })


io.emit('join', "join us soon")

var Recipe = require('./../models/Recipe');
    Recipe.find().populate('User', { "_id": 1, "name": 1, "lastname": 1 }).exec(function (err, response) {
        socket.emit("allrecipe", response)
    });

socket.on("good", (data)=>{
    console.log(data)
})
    socket.on('disconnect', () => {
        console.log("client disconnected")
    })
}
