'use strict';

const Player = require('./player.js');
const PlayerStates = require('./playerStates.js');

module.exports = class HumanPlayer extends Player
{
	constructor(name, bStartedGame, socket)
	{
		super(name, bStartedGame);
		this._socket = socket;
		
		// CLIENT TO SERVER - WAIT PAGE EVENTS
		this._socket.on("clientAddAIFromWaitPage", this.onClientAddAIFromWaitPage.bind(this));
		this._socket.on("clientEndGameFromWaitPage", this.onClientEndGameFromWaitPage.bind(this));
		this._socket.on("clientStartGameWithCurrentPlayers", this.onClientStartGameWithCurrentPlayers.bind(this));

		// CLIENT TO SERVER - GAME EVENTS
		this._socket.on("clientQuitGame", this.onClientQuitGame.bind(this));
		this._socket.on("disconnect", this.onClientQuitGame.bind(this));
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

	startGame(playerList, table)
	{
		this._socket.emit("serverStartGame", {
			playerList: playerList,
			table: table,
			isSpectator: false,
			hand: Array.from(this._hand)
		});
	}

	// CLIENT TO SERVER - WAIT PAGE EVENT HANDLERS

	onClientEndGameFromWaitPage()
	{
		if (this._bStartedGame && this._state == PlayerStates.WaitPage)
			this.emit('playerEndGameFromWaitPage', this);
	}

	onClientAddAIFromWaitPage()
	{
		if (this._bStartedGame && this._state == PlayerStates.WaitPage)
			this.emit('playerAddAIFromWaitPage', this);
	}

	onClientStartGameWithCurrentPlayers()
	{
		if (this._bStartedGame && this._state == PlayerStates.WaitPage)
			this.emit("playerStartGameWithCurrentPlayers", this);
	}

	// CLIENT TO SERVER - GAME EVENT HANDLERS

	onClientQuitGame()
	{
		this.emit('playerQuitGame', this);
	}
}