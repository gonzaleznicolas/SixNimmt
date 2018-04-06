'use strict';

const Player = require('./player.js');

module.exports = class HumanPlayer extends Player
{
	constructor(name, bStartedGame, socket)
	{
		super(name, bStartedGame);
		this._socket = socket;
		
		this._socket.on("clientAddAIFromWaitPage", this.onAddAIFromWaitPage.bind(this));
		this._socket.on("endGame", this.onEndGame.bind(this));
		this._socket.on("quitDuringWait", this.onQuitGame.bind(this));
		this._socket.on("disconnect", this.onQuitGame.bind(this));
		this._socket.on("startGame", this.onStartGame.bind(this));
	}

	get Socket() {return this._socket;}

	leaveRoom(roomName)
	{
		this._socket.leave(roomName);
	}

	onEndGame()
	{
		this.emit('endGame', this);
	}

	onClientAddAIFromWaitPage()
	{
		this.emit('playerAddAIFromWaitPage', this);
	}

	onQuitGame()
	{
		this.emit('quitGame', this);
	}

	onStartGame()
	{
		this.emit("startGame", this);
	}

}