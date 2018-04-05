'use strict';

let Player = require('./player.js');

module.exports = class Game
{
	constructor(firstPlayerName, firstPlayerSocket)
	{
		this._players = new Map();
		this._players.set(firstPlayerName, new Player(firstPlayerName, firstPlayerSocket));
		this._open = true;
	}

	get Open() {return this._open;}

	nameAvailable(name)
	{
		return !this._players.has(name);
	}

	addPlayer(name, socket)
	{
		this._players.set(name, new Player(name, socket))
	}
}