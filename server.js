const http = require('http');
const myanimelists = require('myanimelists');
const mc = require('mongodb');
const uri = "mongodb+srv://Loris:Plouf11@cluster0-c0qzl.gcp.mongodb.net/test?retryWrites=true";
// const client = new mc.MongoClient(uri, { useNewUrlParser: true });

const config  = require('./config');
const restify = require('restify');
const mongodb = require('mongodb').MongoClient;

/**
 * Initialize Server
 */

const server = restify.createServer({
    name    : config.name,
    version : config.version
});
server.use(restify.plugins.bodyParser());
module.exports = function (ctx) {
    const db     = ctx.db;
    const server = ctx.server;

    // assign Users collection to variable for further use
    const collection = db.collection('User');

    server.get('/bdd', (req,res, next) => {
        let limit = parseInt(req.query.limit, 10) || 10, // default limit to 10 docs
            skip  = parseInt(req.query.skip, 10) || 0, // default skip to 0 docs
            query = req.query || {};

        // remove skip and limit from query to avoid false querying
        delete query.skip;
        delete query.limit;

        // find todos and convert to array (with optional query, skip and limit)
        collection.find(query).skip(skip).limit(limit).toArray()
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err));

        next()
    });
};

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

server.get('/', function(req, res, err) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log("We got a connection !");
    res.write("Hi");
    res.end();
});

server.listen(process.env.PORT || 8888, function() {
    console.log('%s listening at %s', server.name, server.url);
});
