'use strict';

let ArtificialPlayer = require('./artificialPlayer.js');
let HumanPlayer = require('./humanPlayer.js');

module.exports = class Game
{
	constructor(gameCode, firstPlayerName, firstPlayerSocket, io)
	{
		this._io = io;
		this._gameCode = gameCode;
		this._roomName = "room_" + this._gameCode;
		this._players = new Map();
		this.addHumanPlayer(firstPlayerName, firstPlayerSocket);
		this._open = true;
		this._spectators = [];
	}

	get Open() {return this._open;}

	nameAvailable(name)
	{
		return !this._players.has(name);
	}

	addHumanPlayer(name, socket)
	{
		this._players.set(name, new HumanPlayer(name, socket));
		socket.join(this._roomName);
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
	}

	// returns AI name
	addArtificialPlayer()
	{
		let name = "Alfonzo";
		let n = 1;
		while (this._players.has(name))
		{
			name = "AI"+n;
		}
		this._players.set(name, new ArtificialPlayer(name));
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
		return name;
	}

	addSpectator(socket)
	{
		this._spectators.push(socket);
		socket.join(this._roomName);
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
	}
}