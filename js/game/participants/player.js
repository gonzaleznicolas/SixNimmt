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
		this._state;
	}

	get Name() {return this._name;}
	get StartedGame() {return this._bStartedGame};
	get Hand() {return this._hand;}
	set Hand(hand) {this._hand = hand}

	// player state is managed by the game. A player never sets its own state
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
	updateUpcomingCards(upcomingCards){}
	run(runObject){}

	// EVENTS TO BE EMITTED BY ANY CLASS DERIVING OFF OF PLAYER
	
	/*
	Event Name:
		"playerPlayCard"
	Payload:
		{player: Player (the player playing card) , playedCard: int (the card being played) }
	When it must be sent:
		The player must be in the state ChooseCard.
		It is the player's responsibility to make sure that the playedCard
		was in fact in the players hand.
		It is also the player's responsibility to delete the playedCard from its hand
		before emitting this event.
		Upon receiving this event, the game will change the player's state from to WaitForRestToPlayTheirCard.
	*/
}