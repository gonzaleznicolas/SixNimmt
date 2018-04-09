'use strict';

const Game = require('./gameLogic/game.js');

module.exports = class GameManager
{
	constructor()
	{
		this._games = new Map();
	}

	gameExists(code)
	{
		return this._games.has(code);
	}

	getGame(code)
	{
		return this._games.get(code);
	}

	addGame(firstPlayerName, firstPlayerSocket, io)
	{
		let candidateGameCode;
		do{
			candidateGameCode = Math.floor(Math.random() * (9999-1000)) + 1000;
		}
		while (this._games.has(candidateGameCode));

		let game = new Game(candidateGameCode, firstPlayerName, firstPlayerSocket);

		// GAME TO GAME MANAGER - EVENTS
		game.on('gameEnded', this.deleteGame.bind(this));


		this._games.set(candidateGameCode, game);
		return candidateGameCode;
	}

	// GAME TO GAME MANAGER - EVENT HANDLERS

	deleteGame(gameCode){
		this._games.delete(gameCode);
	}
}