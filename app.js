var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
var config = require('./config/config');
var secretKey = require('./config/secretKey');

//importing routes
var apiUserRoutes = require('./routes/apiUserRoutes');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors());
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

app.listen(process.env.port || config.serverPort, () => {
    console.log('Server is listening on port ' + config.serverPort);
})

module.exports = app;
