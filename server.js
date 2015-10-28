//SET_UP
var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);
var port = process.env.PORT || 8000;

app.get('*', function(req, res){
	res.sendFile(__dirname + req.url);
});

server.listen(port);
console.log('Server started on port ' + port);
