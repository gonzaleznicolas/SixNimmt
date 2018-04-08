'use strict';

const Player = require('./player.js');

module.exports = class HumanPlayer extends Player
{
	constructor(name, bStartedGame, socket)
	{
		super(name, bStartedGame);
		this._socket = socket;
		
		// game setup messages from client
		this._socket.on("clientAddAIFromWaitPage", this.onClientAddAIFromWaitPage.bind(this));
		this._socket.on("clientEndGameFromWaitPage", this.onClientEndGameFromWaitPage.bind(this));
		this._socket.on("clientQuitGame", this.onClientQuitGame.bind(this));
		this._socket.on("disconnect", this.onClientQuitGame.bind(this));
		this._socket.on("clientStartGameWithCurrentPlayers", this.onClientStartGameWithCurrentPlayers.bind(this));
	}

	get Socket() {return this._socket;}
	
	// UPDATES FROM THE GAME
	updatePlayerList(playerList)
	{
		this._socket.emit('serverPlayerList', playerList);
	}

	terminateGame(nameOfPlayerWhoEndedTheGame)
	{
		this._socket.emit("serverGameTerminated", nameOfPlayerWhoEndedTheGame);
	}

	startGame(playerList)
	{
		this._socket.emit("serverStartGame", {
			isSpectator: false,
			playerList: playerList
		});
	}

	// CLIENT EVENT HANDLERS

	onClientEndGameFromWaitPage()
	{
		if (this._bStartedGame)
			this.emit('playerEndGameFromWaitPage', this);
	}

	onClientAddAIFromWaitPage()
	{
		if (this._bStartedGame)
			this.emit('playerAddAIFromWaitPage', this);
	}

	onClientQuitGame()
	{
		this.emit('playerQuitGame', this);
	}

	onClientStartGameWithCurrentPlayers()
	{
		if (this._bStartedGame)
			this.emit("playerStartGameWithCurrentPlayers", this);
	}
}