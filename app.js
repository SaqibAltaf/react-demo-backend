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

app.listen(config.serverPort, () => {
    console.log('Server is listening on port ' + config.serverPort);
})

module.exports = app;
