const http = require('http');
const myanimelists = require('myanimelists');
const mc = require('mongodb');
const uri = "mongodb+srv://Loris:Plouf11@cluster0-c0qzl.gcp.mongodb.net/test?retryWrites=true";
const mClient = mc.MongoClient(uri, { useNewUrlParser: true });
const restify = require('restify');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cryptoJS = require("crypto-js");



/**
 * Initialize Server
 */
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.get('/', function(req, res, err) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log("We got a connection !");
    res.write("Hello World !");
    res.end();
});

server.get('/bdd/users', (req,res, next) => {
    mClient.connect()
        .then(function (connection) {
            const bdd = connection.db("ApplicationAnime");
            const collection = bdd.collection("Users");
            console.log(collection);
            // Finding documents
            collection.find({}).toArray( function( err, data ) {
                if (err) res.send(500, "Error while trying to find documents in mongodb :" + err);
                console.log(data);
                res.send(200, data);
            });
            // Closing the connection
            mClient.close()
                .then(success => console.log("Succesfully closing the connection"))
                .catch(err => console.log("Error while trying to close the connection :" + err));
        })
        .catch( function (err) {
            console.log(err);
            res.send(500, err);
        });
    next();
});

server.get('/bdd/logs', (req,res, next) => {
    mClient.connect()
        .then(function (connection) {
            const collection = connection.db("ApplicationAnime").collection("CherchLogs");
            console.log(collection);
            // Finding documents
            collection.find({}).toArray( function( err, data ) {
                if (err) res.send(500, "Error while trying to find documents in mongodb :" + err);
                console.log(data);
                res.send(200, data);
            });
            // Closing the connection
            mClient.close()
                .then(success => console.log("Succesfully closing the connection"))
                .catch(err => console.log("Erro while trying to close the connection :" + err));
        })
        .catch( function (err) { console.log(err); res.send(500, err); });
    next();
});

server.get('/newlogs', function (req, res, next) {
    const conn = mongoose.createConnection("mongodb+srv://Loris:Plouf11@cluster0-c0qzl.gcp.mongodb.net/ApplcationAnime?retryWrites=true", {useNewUrlParser: true});
    console.log("connection created");
    const CherchLogSchema = new Schema({
        nomAnime: String,
        genres: [String]
    });
    var Log = conn.model('CherchLog', CherchLogSchema);
    Log.find({}, function (err, docs) {
        if (err) {
            console.log(err);
            res.send(500, "ERROR" + err);
        } else {
            res.send(200, docs);
        }
    });
});
server.get('/anime/byTitle/:title', function( req, res, next) {
    const promiseAnime = myanimelists.getInfoFromName(req.params.title);
    promiseAnime.then(function (result) {
        res.contentType = 'json';
        const conn = mongoose.createConnection("mongodb+srv://Loris:Plouf11@cluster0-c0qzl.gcp.mongodb.net/ApplicationAnime?retryWrites=true", {useNewUrlParser: true});
        console.log("connection created");
        const CherchLogSchema = new Schema({
            nomAnime: String,
            genres: [String]
        });
        var Log = conn.model('CherchLog', CherchLogSchema);
        var toStore = new Log({nomAnime: result.title, genres: result.tags});
        toStore.save(function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Success databasing");
            }
            res.send(result);
            next();
        });
    });
});

server.get('/toAuth', function( req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<html>" +
        "<body>" +
        "<form action='https://salty-ocean-70640.herokuapp.com/auth' method='POST'>" +
        "<input type='text' name='login' placeholder='login'>" +
        "<input type='password' name='pass' placeholder='password'>" +
        "<input type='submit' value='Submit'> " +
        "</form>" +
        "</body>" +
        "</html>");
    res.end();
});

server.post('/auth', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("login = " + req.body.login);
    var hashedpass = cryptoJS.SHA512(req.body.pass);
    res.write("pass = " + hashedpass);

});

server.listen(process.env.PORT || 8888, function() {
    console.log('%s listening at %s', server.name, server.url);
});
