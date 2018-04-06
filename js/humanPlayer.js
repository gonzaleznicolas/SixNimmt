'use strict';

let Player = require('./player.js');

module.exports = class HumanPlayer extends Player
{
	constructor(name, socket)
	{
		super(name);
		this._socket = socket;
		
		this._socket.on("addAIFromWaitPage", this.onAddAIFromWaitPage.bind(this));
		this._socket.on("endGame", this.onEndGame.bind(this));
		this._socket.on("quitDuringWait", this.onQuitGame.bind(this));
		this._socket.on("disconnect", this.onQuitGame.bind(this));
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

	onAddAIFromWaitPage()
	{
		this.emit('addAIFromWaitPage', this);
	}

	onQuitGame()
	{
		this.emit('quitGame', this);
	}

}