var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
var config = require('./config/config');
var secretKey = require('./config/secretKey');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors());

//setup socket
var server = require('http').createServer(app);  
var io =module.exports.io = require('socket.io')(server);
var socketManger= require('./config/socketManger');

io.set('origins', '*:*');

io.on('connection', socketManger);

//importing routes
var apiUserRoutes = require('./routes/apiUserRoutes');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', (err) => {
    console.log('Error Connecting to Mongodb ', err);
});

db.on('open', () => {
    console.log('Connection Established to Mongodb');
});


app.use('/api/user/', apiUserRoutes);



app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.port || config.serverPort, () => {
    console.log('Server is listening on port ' + config.serverPort);
})

module.exports = app;
