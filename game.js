'use strict';

let Player = require('./player.js');

module.exports = class Game
{
	constructor(gameCode, firstPlayerName, firstPlayerSocket, io)
	{
		this._io = io;
		this._gameCode = gameCode;
		this._roomName = "room_" + this._gameCode;
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
		this._players.set(name, new Player(name, socket));
		socket.join(this._roomName);
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
	}
}