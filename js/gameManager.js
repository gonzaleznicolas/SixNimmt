'use strict';

const Game = require('./game.js');

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

		let game = new Game(candidateGameCode, firstPlayerName, firstPlayerSocket, io);
		game.on('gameEndedFromWaitPage', this.deleteGame.bind(this));
		this._games.set(candidateGameCode, game);
		return candidateGameCode;
	}

	deleteGame(gameCode){
		this._games.delete(gameCode);
	}
}