'use strict';

let GameManager = require('./gameManager.js');

let io;
let gameManager = new GameManager();

module.exports = function (IO){
	io = IO;
	io.on('connection', onConnection);
}

function onConnection(socket) {
	console.log('A user connected');
 
	socket.on('disconnect', function () {
	   console.log('A user disconnected');
	});

	socket.on("newGame", onNewGame);
	socket.on("joinGame", onJoinGame);
	socket.on("vsAI", onVsAI);
 }

function onNewGame(data){
	console.log("New game started");
	let nickName = capitalizeNickName(data.nickName);
	let validForm = undefined;
	if (isPossibleNickName(nickName))
	{
		let gameCode = gameManager.addGame(nickName, this, io);
		validForm = {valid: true, gameCode: gameCode, firstPlayerName: nickName};
	}
	else
	{
		validForm = {valid: false};
	}

	this.emit("newGameFormResult", validForm);
}

function onJoinGame(data){
	let codeValid = false;
	let nameValid = false;
	let nickName = undefined;
	let gc = undefined;
	if (isPossibleNickName(data.nickName))
		nameValid = true;
	if (isPossibleCode(data.gameCode))
	{
		gc = parseInt(data.gameCode);
		if (gameManager.gameExists(gc) && gameManager.getGame(gc).Open)
		{
			let game = gameManager.getGame(gc);
			codeValid = true;
			nameValid = false;
			nickName = capitalizeNickName(data.nickName);
			if (isPossibleNickName(nickName))
			{
				if (game.nameAvailable(nickName))
				{
					nameValid = true;
					game.addPlayer(nickName, this);
				}
			}
			
		}
	}

	this.emit("joinGameFormResult", {codeValid: codeValid, nameValid: nameValid, 
									gameCode: data.gameCode, nickName: nickName});
}

function onVsAI(data)
{
	gameManager.addGame("You", this, io);
	this.emit("vsAIFormResult", {});
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
	return str.match(/^[0-9a-zA-Z]*$/) != null;
}

function isNumeric(str)
{
	str = str.toString().trim();
	return str.match(/^[0-9]*$/) != null;
}

function capitalizeNickName(name)
{
	let trimmed = name.toString().trim();
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
