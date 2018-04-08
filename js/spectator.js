'use strict'; 
 
module.exports = class Spectator 
{ 
	constructor(socket) 
	{
		this._socket = socket; 
	}

	// MESSAGES FROM THE GAME

	updatePlayerList(playerList)
	{
		this._socket.emit('serverPlayerList', playerList);
	}

	terminateGame(nameOfPlayerWhoEndedTheGame)
	{
		this._socket.emit("serverGameTerminated", nameOfPlayerWhoEndedTheGame);
	}
}