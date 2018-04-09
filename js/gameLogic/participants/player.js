'use strict';

const EventEmitter = require('events');
const Player = require('./playerStates.js');

module.exports = class Player extends EventEmitter
{
	constructor(name, bStartedGame)
	{
		super();
		this._name = name;
		this._bStartedGame = bStartedGame;
		this._hand = undefined;
	}

	get Name() {return this._name;}
	get StartedGame() {return this._bStartedGame};
	get Hand() {return this._hand;}
	set Hand(hand) {this._hand = hand}

	// METHODS TO BE IMPLEMENTED BY ANY CLASS DERIVING OFF OF PLAYER
	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}
	startGame(playerList, table){}
}