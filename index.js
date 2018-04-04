'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let GameManager = require('./gameManager.js');

// allow files in public directory to be served as static files
app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile( __dirname + "/" + "index.html" );
});

http.listen(80, function() {
	console.log("Listening on port 80.");
});

io.on('connection', function(socket) {
	console.log('A user connected');
 
	socket.on('disconnect', function () {
	   console.log('A user disconnected');
	});

	socket.on("newGame", onNewGame);
 });

let gameManager = new GameManager();

function onNewGame(data){
	console.log("New game started");
	let validForm = undefined;
	if (isPossibleNickName(data.nickName))
	{
		validForm = {valid: true};
	}
	else
	{
		validForm = {valid: false};
	}

	this.emit("newGameFormResult", validForm);
}

function isPossibleNickName(str)
{
	str = str.toString();
	return isAlphanumeric(str) && str.length <= 6 && str.length > 0;
}

function isPossibleCode(str)
{
	str = str.toString().trim();
	return isNumeric(str) && str.length == 4;
}

function isAlphanumeric(str)
{
	str = str.toString().trim();
	return str.match(/^[0-9a-z]*$/) != null;
}

function isNumeric(str)
{
	return str.match(/^[0-9]*$/) != null;
}

