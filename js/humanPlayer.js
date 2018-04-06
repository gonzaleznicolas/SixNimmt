'use strict';

let Player = require('./player.js');

module.exports = class HumanPlayer extends Player
{
	constructor(name, socket)
	{
		super(name);
		this._socket = socket;
		
		this._socket.on("addAIFromWaitPage", this.onAddAIFromWaitPage.bind(this));
		this._socket.on("quitDuringWait", this.onQuitGameDuringWait.bind(this));
	}

	leaveRoom(roomName)
	{
		this._socket.leave(roomName);
	}

	onAddAIFromWaitPage()
	{
		this.emit('addAIFromWaitPage', this);
	}

	onQuitGameDuringWait()
	{
		this.emit('quitDuringWait', this);
	}

}