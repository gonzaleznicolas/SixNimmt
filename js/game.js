'use strict';

const ArtificialPlayer = require('./artificialPlayer.js');
const HumanPlayer = require('./humanPlayer.js');
const EventEmitter = require('events');

module.exports = class Game extends EventEmitter
{
	constructor(gameCode, firstPlayerName, firstPlayerSocket, io)
	{
		super();
		this._io = io;
		this._gameCode = gameCode;
		this._roomName = "room_" + this._gameCode;
		this._players = new Map();
		this.addHumanPlayer(firstPlayerName, firstPlayerSocket);
		this._open = true;
		this._spectators = [];
	}

	subscribeToPlayerEvents(player)
	{
	}

	subscribeToHumanPlayerEvents(player)
	{
		player.on("addAIFromWaitPage", this.onAddAIFromWaitPage.bind(this));
		player.on("quitGame", this.onPlayerLeave.bind(this));
		player.on("endGame", this.onEndGame.bind(this));
	}

	get Open() {return this._open;}

	updateOpen()
	{
		if (this._players.size >= 10)
			this._open = false;
		else
			this._open = true;
	}

	nameAvailable(name)
	{
		return !this._players.has(name);
	}

	addHumanPlayer(name, socket)
	{
		let player = new HumanPlayer(name, socket);
		this._players.set(name, player);
		this.subscribeToPlayerEvents(player);
		this.subscribeToHumanPlayerEvents(player);
		socket.join(this._roomName);
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
		this.updateOpen();
	}

	// returns AI name
	addArtificialPlayer()
	{
		let n = 1;
		let name;
		do{
			name = "AI"+n;
			n++;
		} while (this._players.has(name));

		let player = new ArtificialPlayer(name);
		this._players.set(name, player);
		this.subscribeToPlayerEvents(player);
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
		this.updateOpen();
		return name;
	}

	addSpectator(socket)
	{
		this._spectators.push(socket);
		socket.join(this._roomName);
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
	}

	removePlayer(name)
	{
		if (!this._players.has(name))
			return;
		let player = this._players.get(name);
		if (player.leaveRoom)
			player.leaveRoom(this._roomName);
		this._players.delete(name);
		this._io.sockets.in(this._roomName).emit('playerList', Array.from(this._players.keys()));
		this.updateOpen();
	}

	onEndGame(player)
	{
		player.Socket.broadcast.to(this._roomName).emit("gameTerminated", player.Name);
		this.emit("gameEnded", this._gameCode);
	}

	onAddAIFromWaitPage(player)
	{
		this.addArtificialPlayer();
	}

	onPlayerLeave(player)
	{
		this.removePlayer(player.Name);
	}
}