var io = require('./../app').io;

module.exports = function (socket) {
    console.log("connect", socket.id)
    io.to(socket.id).emit('chat1')
    socket.on('connect', () => {
      
        console.log("client connected")
    })
    socket.username ="anonymous";

    socket.on('user_name', (data) => {
        console.log("client connected", data)
    })
    socket.on('chat1', (chat) =>{
        io.to(socket.id).emit("chatServer", chat)
    })

   

    var Recipe = require('./../models/Recipe');
    Recipe.find().populate('User', { "_id": 1, "name": 1, "lastname": 1 }).exec(function (err, response) {
        socket.emit("allrecipe", response)
    });

    
    socket.on('disconnect', () => {
        console.log("client disconnected")
    })
}
