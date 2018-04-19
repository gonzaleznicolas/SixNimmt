'use strict'; 

const EventEmitter = require('events');
const SpectatorStates = require('../gameGlobals.js').SpectatorStates;

module.exports = class Spectator extends EventEmitter
{ 
	constructor(socket) 
	{
		super();
		this._socket = socket;
		this._state;

		this._socket.on("clientQuitGame", this.onClientQuitGame.bind(this));
		this._socket.on("disconnect", this.onClientQuitGame.bind(this));
		this._socket.on("clientDoneDisplayingRound", this.onClientDoneDisplayingRound.bind(this));
	}

	get Socket() {return this._socket;}

	// spectator state is managed by the game. A spectator never sets its own state
	get State() {return this._state;}
	set State(state) {this._state = state;}

	// METHODS CALLED BY THE GAME

	removeDisconnectListener()
	{
		console.log('removing disconnect handler from spectator with id '+this._socket.id);
		this._socket.removeListener('disconnect', this.onClientQuitGame.bind(this));
	}

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
			isSpectator: true,
			name: this._name
		});
	}

	updateUpcomingCards(upcomingCards)
	{
		this._socket.emit("serverUpcomingCards", upcomingCards);
	}

	roundInfo(roundStepSequence, bItsAReplay)
	{
		this._socket.emit("serverRoundInfo", {roundStepSequence: roundStepSequence, bItsAReplay: bItsAReplay} );
	}

	startRound(table, scoreboard)
	{
		this._socket.emit('serverStartRound', {table: table, scoreboard: scoreboard});
	}

	// CLIENT TO SERVER - GAME EVENT HANDLERS

	onClientQuitGame()
	{
		console.log("Spectator with ID " + this._socket.id + " has disconnected/quit the game");
		this.emit('spectatorQuitGame', this);
	}

	onClientDoneDisplayingRound()
	{
		if (this._state != SpectatorStates.RoundAnimationInProgress)
		{
			console.log("clientDoneDisplayingRound was received at an unexpected time or sent a card that the player does not have. Ignored.");
			return;
		}
		this.emit("playerOrSpectatorDoneDisplayingRound", this);
	}
}