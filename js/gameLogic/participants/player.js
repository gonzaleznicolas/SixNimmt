'use strict';

const EventEmitter = require('events');
const Player = require('./playerStates.js');
const PlayerStates = require('./playerStates.js');

module.exports = class Player extends EventEmitter
{
	constructor(name, bStartedGame)
	{
		super();
		this._name = name;
		this._bStartedGame = bStartedGame;
		this._hand = undefined;
		this._state = PlayerStates.WaitPage;
	}

	get Name() {return this._name;}
	get StartedGame() {return this._bStartedGame};
	get Hand() {return this._hand;}
	set Hand(hand) {this._hand = hand}
	get State() {return this._state;}
	set State(state) {this._state = state;}

	// METHODS TO BE IMPLEMENTED BY ANY CLASS DERIVING OFF OF PLAYER
	// eg. the artificial player doesnt need some of these methods like updatePlayerList()
	// but it does need to implement it even if it does nothing.
	// It has to be implemented because at one time or another, the game will call these methods
	// on each of its players regardless of if they are human or artificial.
	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}
	startGame(playerList, table){}
	updateUpcomingCards(cards, namesOnCards){}
}