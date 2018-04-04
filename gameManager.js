'use strict';

let Game = require('./Game.js');

module.exports = class GameManager
{
	constructor()
	{
		this._games = new Map();
	}

	addGame(firstPlayerName, firstPlayerSocket)
	{
		let candidateGameCode;
		do{
			candidateGameCode = Math.floor(Math.random() * (9999-1000)) + 1000;
		}
		while (this._games.has(candidateGameCode));

		this._games.set(candidateGameCode, new Game(firstPlayerName, firstPlayerSocket));
		return candidateGameCode;
	}
}