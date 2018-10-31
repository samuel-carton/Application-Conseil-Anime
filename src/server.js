var http = require('http');
var dt = require('./firstmodule');
var url = require('url');
var fs = require('fs');

http.createServer(function (request, response){

    var route = url.parse(request.url, true).pathname;
    switch ( route  ){

        case "/home": {
            response.writeHead( 200, {'Content-Type': 'text/html'});
            response.write("<!DOCTYPE HTML>" +
                "<html>" +
                "<head>" +
                "<title> Acceuil </title>" +
                "</head>" +
                "<body>" +
                "<h1> Hello World ! </h1>" +
                "<p> You are on " + route + " </p>" +
                "</body>" +
                "</html>" +
                "");
            response.end();
            break;
        }
        case "/logging": {
            var toLog = " --- Log " + dt.myDateTime() + " ---\n" +
                "A connection has been made : IP = " + request.connection.remoteAddress + "/\n";
            fs.appendFile('../Logs/logs.txt', toLog, function (err) {
                if (err) throw err;
                console.log('We got a connection');
            });
            response.writeHead(200, {'Content-Type': 'Souriez vous êtes filmés'});
            response.write("<!DOCTYPE HTML>" +
                "<html>" +
                "<head>" +
                "<title> Logging .... </title>" +
                "</head>" +
                "<body>" +
                "<h1> Haha </h1>" +
                "<p> You are on " + route + " and I took your IP </p>" +
                "</body>" +
                "</html>" +
                "");
            response.end();
            break;
        }
        case "/logs": {
            console.log("Someone tried to read the logs ... ");
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write("<!DOCTYPE HTML>" +
                "<html>" +
                "<head>" +
                "<title> Logs </title>" +
                "</head>" +
                "<body>" +
                "<h1> The sacred Logs </h1>" +
                "<p> You are on " + route + " </p>" +
                "<p id =\"logs\"></p>"
            );
            /*readingAFile( '../Logs/logs.txt', function(data) {
                response.write("</body>" +
                    "<p>" + data + "</p>" +
                    "</html>")
                response.end; } )
            console.log("Someone read the logs !");*/
            fs.readFile("../Logs/logs.txt", 'utf8', function(err, data){
                if(err) {
                    console.log("... and failed probably");
                    throw err;
                }
                console.log(" ... and succeed !");
                data.split("/").forEach( function(element) {
                    response.write("<p>" + element + "</p>");
                });
                // response.write(data);
                response.end();
            });
            break;
        }
        default :{
            response.writeHead( 404, {'Content-Type': 'text/html'});
            response.write("<!DOCTYPE HTML>" +
                "<html>" +
                "<head>" +
                "<title> 404 Error </title>" +
                "</head>" +
                "<body>" +
                "<h1> This page doesn't exist </h1>" +
                "<p> You are on " + route + " </p>" +
                "</body>" +
                "</html>" +
                "");
            response.end();
        }
    }
}).listen(8888);

function readingAFile(filePath, callback) {
    var str = '';
    fs.readFile(filePath, 'utf8', function(err, data){
        if(err) throw err;
        callback(data);
    });
}