const http = require('http');
const myanimelists = require('myanimelists');
const mc = require('mongodb');
const uri = "mongodb+srv://Loris:Plouf11@cluster0-c0qzl.gcp.mongodb.net/test?retryWrites=true";
// const client = new mc.MongoClient(uri, { useNewUrlParser: true });
const restify = require('restify');
const mClient = mc.MongoClient(uri, { useNewUrlParser: true });

/**
 * Initialize Server
 */
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.get('/', function(req, res, err) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log("We got a connection !");
    res.write("Hi");
    res.end();
});

server.get('/bdd/users', (req,res, next) => {
    mClient.connect()
        .then(function (connection) {
            const bdd = connection.db("ApplicationAnime");
            const collection = bdd.collection("User");
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
            const collection = connection.db("ApplicationAnime").collection("CherchLog");
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
    promiseAnime.then(function(result){
        res.contentType = 'json';
        mClient.connect()
            .then(function (connection) {
                const logs = connection.db("ApplicationAnime").collection("CherchLog");
                // perform actions on the collection object
                // Inserting some documents
                logs.insertMany([
                    {nomAnime: result.title, tags: result.genres}
                ]).then( function(scs) {
                    console.log("Inserted a document into the collection : " + scs);
                    })
                .catch( function (err) {
                    console.log("Error while inserting into the database : " + err);
                    res.send(err);
                });
                mClient.close()
                    .then(success => console.log("Succesfully closing the connection"))
                    .catch(err => console.log("Erro while trying to close the connection :" + err));
            })
            .catch( function (err) { console.log(err); res.send(500, err); });
        res.send(result);
        }).catch(error => console.log(error));
    next();
    }
);

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

server.listen(process.env.PORT || 8888, function() {
    console.log('%s listening at %s', server.name, server.url);
});
