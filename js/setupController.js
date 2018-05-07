'use strict';

let StringFunctions = require('./stringFunctions.js');
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
	   this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents = false;
	});

	// CLIENT TO SERVER - FORM SUBMITTED EVENTS
	socket.on("clientNewGame", onClientNewGame);
	socket.on("clientJoinGame", onClientJoinGame);
	socket.on("client1v1vsAI", onClient1v1vsAI);
	socket.on("clientSpectateGame", onClientSpectateGame);
}


// CLIENT TO SERVER - FORM SUBMITTED EVENT HANDLERS

function onClientNewGame(data){
	if (this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents)
	{
		console.log("clientNewGame received at unexpected time. Ignored.");
		return;
	}
	console.log("New game started");
	let nickName = StringFunctions.capitalizeNickName(data.nickName);
	let nameValid = false;
	let gameCode = undefined;
	if (StringFunctions.isPossibleNickName(nickName))
	{
		gameCode = gameManager.addGame(nickName, this, io);
		nameValid = true;

		// so that if this socket fires a home page event while in game, we ignore it.
		// This is part of the effort to ignore any events emmitted by the client when the server is not expecting it.
		// Do not trust anything from the client.
		this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents = true;
	}

	this.emit("serverNewGameFormResult", {nameValid: nameValid, gameCode: gameCode});
}

function onClientJoinGame(data){
	if (this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents)
	{
		console.log("clientJoinGame received at unexpected time. Ignored.");
		return;
	}
	let codeValid = false;
	let nameValid = false;
	let nickName = undefined;
	let gc = undefined;
	if (StringFunctions.isPossibleNickName(data.nickName))
		nameValid = true;
	if (StringFunctions.isPossibleCode(data.gameCode))
	{
		gc = parseInt(data.gameCode);
		if (gameManager.gameExists(gc) && gameManager.getGame(gc).Open)
		{
			let game = gameManager.getGame(gc);
			codeValid = true;
			nameValid = false;
			nickName = StringFunctions.capitalizeNickName(data.nickName);
			if (StringFunctions.isPossibleNickName(nickName))
			{
				if (game.nameAvailable(nickName))
				{
					nameValid = true;
					game.addHumanPlayer(nickName, false, this);
					this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents = true;
				}
			}
			
		}
	}

	this.emit("serverJoinGameFormResult", {codeValid: codeValid, nameValid: nameValid, 
									gameCode: data.gameCode});
}

function onClient1v1vsAI(data)
{
	if (this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents)
	{
		console.log("client1v1vsAI received at unexpected time. Ignored.");
		return;
	}
	let nickName = StringFunctions.capitalizeNickName(data.nickName);
	let nameValid = false;
	if (StringFunctions.isPossibleNickName(nickName))
	{
		nameValid = true;
		let gc = gameManager.addGame(nickName, this, io);
		let aiName = gameManager.getGame(gc).addArtificialPlayer();
		this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents = true;
	}
	this.emit("server1v1vsAIFormResult", {nameValid: nameValid});
}

function onClientSpectateGame(data)
{
	if (this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents)
	{
		console.log("clientSpectateGame received at unexpected time. Ignored.");
		return;
	}
	let codeValid = false;
	let gc = undefined;
	if (StringFunctions.isPossibleCode(data.gameCode))
	{
		gc = parseInt(data.gameCode);
		if (gameManager.gameExists(gc))
		{
			gameManager.getGame(gc).addSpectator(this);
			codeValid = true;
			this.thisSocketIsInTheMiddleOfAGameAsAPlayerOrSpectator_IgnoreHomePageEvents = true;
		}
	}

	this.emit("serverSpectateGameFormResult", {codeValid: codeValid, gameCode: data.gameCode});
}
