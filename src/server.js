var http = require('http');
var dt = require('./firstmodule');
var url = require('url');
var fs = require('fs');


http.createServer(function (request, response){
    /*
    fs.readFile('base.html', function(err, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });*/

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<p>" + request.url + "</p>");
    response.write("<p> The date and time are currently: " + dt.myDateTime() + "</p>");
    var data = url.parse(request.url, true).query;
    var toReturn = data.year + " " + data.month + " " + data.day;
    response.write("<p>" + toReturn + "</p>");

    response.end();
}).listen(8888);