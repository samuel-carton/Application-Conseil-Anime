const http = require('http');
const dt = require('./firstmodule');
const url = require('url');
const myanimelists = require('myanimelists');
const restify = require('restify');


// http.createServer(function (request, response){
//
//     const route = url.parse(request.url, true).pathname;
//     switch ( route  ){
//
//         case "/home": {
//             response.writeHead( 200, {'Content-Type': 'text/html'});
//             response.write("<!DOCTYPE HTML>" +
//                 "<html>" +
//                 "<head>" +
//                 "<title> Acceuil </title>" +
//                 "</head>" +
//                 "<body>" +
//                 "<h1> Hello World ! </h1>" +
//                 "<p> You are on " + route + "</p>" +
//                 "</body>" +
//                 "</html>" +
//                 "");
//             response.end();
//             break;
//         }
//         case "/logging": {
//             var toLog = " --- Log " + dt.myDateTime() + " ---\n" +
//                 "A connection has been made : IP = " + request.connection.remoteAddress + "/\n";
//             fs.appendFile('../Logs/logs.txt', toLog, function (err) {
//                 if (err) throw err;
//                 console.log('We got a connection');
//             });
//             response.writeHead(200, {'Content-Type': 'Souriez vous êtes filmés'});
//             response.write("<!DOCTYPE HTML>" +
//                 "<html>" +
//                 "<head>" +
//                 "<title> Logging .... </title>" +
//                 "</head>" +
//                 "<body>" +
//                 "<h1> Haha </h1>" +
//                 "<p> You are on " + route + " and I took your IP </p>" +
//                 "</body>" +
//                 "</html>" +
//                 "");
//             response.end();
//             break;
//         }
//         case "/logs": {
//             console.log("Someone tried to read the logs ... ");
//             response.writeHead(200, {'Content-Type': 'text/html'});
//             response.write("<!DOCTYPE HTML>" +
//                 "<html>" +
//                 "<head>" +
//                 "<title> Logs </title>" +
//                 "</head>" +
//                 "<body>" +
//                 "<h1> The sacred Logs </h1>" +
//                 "<p> You are on " + route + " </p>" +
//                 "<p id =\"logs\"></p>"
//             );
//             /*readingAFile( '../Logs/logs.txt', function(data) {
//                 response.write("</body>" +
//                     "<p>" + data + "</p>" +
//                     "</html>")
//                 response.end; } )
//             console.log("Someone read the logs !");*/
//             fs.readFile("../Logs/logs.txt", 'utf8', function(err, data){
//                 if(err) {
//                     console.log("... and failed probably");
//                     throw err;
//                 }
//                 console.log(" ... and succeed !");
//                 data.split("/").forEach( function(element) {
//                     response.write("<p>" + element + "</p>");
//                 });
//                 // response.write(data);
//                 response.end();
//             });
//             break;
//         }
//         case "/animes" : {
//             response.writeHead(200, {'Content-Type': 'text/html'});
//             var promiseAnime = myanimelists.getInfoFromName('Golden Wind', 'anime');
//             promiseAnime.then(function(result){
//                 var keys = Object.keys(result);
//                 console.log(keys);
//                 response.write(keys.join() + "</br>");
//                 response.write(result.title + "</br>");
//                 response.write(result.synopsis + "</br>");
//                 var imgLink = result.picture;
//                 response.write("<img src=\"" + imgLink + "\">");
//                 response.write(JSON.stringify(result));
//                 response.end();
//             }).catch(error => console.log(error));
//             break;
//         }
//         case "/auth": {
//
//             break;
//         }
//         default :{
//             response.writeHead( 404, {'Content-Type': 'text/html'});
//             response.write("<!DOCTYPE HTML>" +
//                 "<html>" +
//                 "<head>" +
//                 "<title> 404 Error </title>" +
//                 "</head>" +
//                 "<body>" +
//                 "<h1> This page doesn't exist </h1>" +
//                 "<p> You are on " + route + " </p>" +
//                 "</body>" +
//                 "</html>" +
//                 "");
//             response.end();
//         }
//     }
// }).listen(8888);

/*
function readingAFile(filePath, callback) {
    var str = '';
    fs.readFile(filePath, 'utf8', function(err, data){
        if(err) throw err;
        callback(data);
    });
}*/


const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.get('/anime/byTitle/:title', function( req, res, next) {
    const promiseAnime = myanimelists.getInfoFromName(req.params.title, 'anime');
    promiseAnime.then(function(result){
        res.contentType = 'json';
        res.send(result);
        return next();
        }).catch(error => console.log(error));
    }
);

server.get('/', function(req, res, err) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log("We got a connection !")
    res.write("Hi");
    res.end();
});

server.post('/auth', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log(req.body.pseudo);
    res.write("What you submitted : Pseudo = " + req.body.pseudo + ", MDP = " + req.body.pass);
    res.end();
});

server.get('/toAuth', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<!DOCTYPE html><html>" +
        "<head>" +
        "<title> Authentifiez vous ! </title>" +
        "<body>" +
        "<form action=\"/auth\" method=\"post\">" +
        "<div>" +
        "<label for=\"pseudo\"> Your pseudo </label>" +
        "<input name=\"pseudo\" id=\"pseudo\" type=\"text\" />" +
        "<label for=\"pass\"> Your password </label>" +
        "<input name=\"pass\" id=\"pass\" type=\"password\" />" +
        "<input name=\"submit\" id=\"submit\" type=\"submit\" value=\"Valider\"/>" +
        "</div>" +
        "</form>" +
        "</body>" +
        "</head>");
    res.end();
});

server.listen(process.env.PORT || 8888, function() {
    console.log('%s listening at %s', server.name, server.url);
});
