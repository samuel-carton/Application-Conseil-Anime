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

server.get('/anime/byTitle/:title', function( req, res, next) {
    const promiseAnime = myanimelists.getInfoFromName(req.params.title);
    promiseAnime.then(function (result) {
        res.contentType = 'json';
        // mClient.connect()
        //     .then(function (connection) {
        //         const logs = connection.db("ApplicationAnime").collection("CherchLog");
        //         // perform actions on the collection object
        //         // Inserting some documents
        //         logs.insertMany([
        //             {nomAnime: result.title, tags: result.genres}
        //         ]).then( function(scs) {
        //             console.log("Inserted a document into the collection : " + scs);
        //             })
        //         .catch( function (err) {
        //             console.log("Error while inserting into the database : " + err);
        //             res.send(err);
        //         });
        //         mClient.close()
        //             .then(success => console.log("Succesfully closing the connection"))
        //             .catch(err => console.log("Erro while trying to close the connection :" + err));
        //     })
        //     .catch( function (err) { console.log(err); res.send(500, err); });
        // res.send(result);
        // }).catch(error => console.log(error));
        res.send(result);
        const conn = mongoose.createConnection("mongodb+srv://Loris:Plouf11@cluster0-c0qzl.gcp.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});

        const CherchLogSchema = new Schema({
            nomAnime: String,
            genres: [String]
        });
        var Log = conn.model('User', CherchLogSchema);
        var toStore = new Log({nomAnime: result.title, genres: result.tags});
        toStore.save(function (err) {
            if (err) console.log(err);
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
    // mClient.connect()
    //     .then(function (connection) {
    //         const db = connection.db("ApplicationAnime");
    //         const users = db.collection("User");
    //         users.insertMany([{login: req.body.login, pass: hashedpass}])
    //             .then( success => console.log("Successfully adding a user : " + success))
    //             .catch(err => console.log("Error while adding a user to the db : " + err));
    //         mClient.close()
    //             .then( success => console.log("Successfully closing the connection : " + success))
    //             .catch(err => console.log("Error while closing the connection : " + err));
    //         res.end();
    //     }).catch ( function (err) {
    //         console.log("Error while connecting to the databse : " + err)
    //         res.end();
    //     });
    // const conn = mongoose.createConnection("mongodb+srv://Loris:Plouf11@cluster0-c0qzl.gcp.mongodb.net/test?retryWrites=true");
    // const mdl = mongoose.model()
});

server.listen(process.env.PORT || 8888, function() {
    console.log('%s listening at %s', server.name, server.url);
});
