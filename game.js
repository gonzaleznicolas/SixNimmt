'use strict';

let Player = require('./player.js');

module.exports = class Game
{
	constructor(firstPlayerName, firstPlayerSocket)
	{
		this._players = new Map();
		this._players.set(firstPlayerName, new Player(firstPlayerName, firstPlayerSocket));
	}
}