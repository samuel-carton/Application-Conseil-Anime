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

server.get('/bdd', (req,res, next) => {
    mClient.connect()
        .then(function (connection) {
            const collection = connection.db("ApplicationAnime").collection("User");
            console.log(collection);
        })
        .catch( function (err) { console.log(err); res.send(500, err) });
    next();
});

server.get('/anime/byTitle/:title', function( req, res, next) {
    const promiseAnime = myanimelists.getInfoFromName(req.params.title, 'anime');
    promiseAnime.then(function(result){
        res.contentType = 'json';
        client.connect(err => {
            const logs = client.db("ApplicationAnime").collection("CherchLog");
            // perform actions on the collection object
            // Inserting some documents
            logs.insertMany([
                {nomAnime: result.title, tags: result.genres}
            ], function(err, result) {
                console.log("Inserted a document into the collection");
            });
            client.close();
        });
        res.send(result);
        return next();
        }).catch(error => console.log(error));
    }
);

server.listen(process.env.PORT || 8888, function() {
    console.log('%s listening at %s', server.name, server.url);
});
