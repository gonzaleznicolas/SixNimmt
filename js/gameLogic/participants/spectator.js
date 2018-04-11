'use strict'; 
 
module.exports = class Spectator 
{ 
	constructor(socket) 
	{
		this._socket = socket; 
	}

	// METHODS CALLED BY THE GAME

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

	updateUpcomingCards(cards, namesOnCards)
	{
		this._socket.emit("serverUpcomingCards", {
			cards: cards,
			namesOnCards: namesOnCards
		});
	}
}