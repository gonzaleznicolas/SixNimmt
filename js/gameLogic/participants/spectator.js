'use strict'; 
 
module.exports = class Spectator 
{ 
	constructor(socket) 
	{
		this._socket = socket; 
	}

	// UPDATES FROM THE GAME

	updatePlayerList(playerList)
	{
		this._socket.emit('serverPlayerList', playerList);
	}

	terminateGame(nameOfPlayerWhoEndedTheGame)
	{
		this._socket.emit("serverGameTerminated", nameOfPlayerWhoEndedTheGame);
	}

	startGame(playerList, table)
	{
		this._socket.emit("serverStartGame", {
			playerList: playerList,
			table: table,
			isSpectator: true
		});
	}
}