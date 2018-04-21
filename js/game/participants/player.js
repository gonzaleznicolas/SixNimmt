'use strict';

const EventEmitter = require('events');
const PlayerStates = require('../gameGlobals.js').PlayerStates;

module.exports = class Player extends EventEmitter
{
	constructor(name, bStartedGame)
	{
		super();
		this._name = name;
		this._bStartedGame = bStartedGame;
		this._hand = undefined;
		this._state;

		// the following set is used by the artificial player to make its decisions.
		// however, maintain it even for human players. This is so that when a human player
		// quits, the artificial player can take over and know which cards have already been played.
		// it is a set of cards that no player can have in their cand because they have already been on the table.
		this._setOfCardsIveSeenAlready = new Set();
	}

	get Name() {return this._name;}
	get StartedGame() {return this._bStartedGame};
	get Hand() {return this._hand;}
	set Hand(hand) {this._hand = hand}
	get SetOfCardsIveSeenAlready() {return this._setOfCardsIveSeenAlready;}
	set SetOfCardsIveSeenAlready(set) {this._setOfCardsIveSeenAlready = set}

	// player state is managed by the game. A player never sets its own state
	get State() {return this._state;}
	set State(state) {this._state = state;}

	addCardsOnTableToSetOfCardsIveSeenAlready(table)
	{
		if (table.length != 4)
			throw "This is not a proper table. It doesnt have 4 rows.";

		table.forEach( function (row) {
			if (row[0])
				this._setOfCardsIveSeenAlready.add(row[0]);
		}.bind(this));
	}

	addCardsFromUpcomingCardsToSetOfCardsIveSeenAlready(upcomingCards)
	{
		upcomingCards.forEach( function (card) {
			if (card.number)
				this._setOfCardsIveSeenAlready.add(card.number);
		}.bind(this));
	}

	// METHODS TO BE IMPLEMENTED BY ANY CLASS DERIVING OFF OF PLAYER
	// eg. the artificial player doesnt need some of these methods like updatePlayerList()
	// but it does need to implement it even if it does nothing.
	// It has to be implemented because at one time or another, the game will call these methods
	// on each of its players regardless of if they are human or artificial.

	removeDisconnectListener(){}
	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}
	startGame(playerList, table){}
	updateUpcomingCards(upcomingCards){}

	// the player must not modify roundStepSequence. Just read. It belongs to the game.
	roundInfo(roundStepSequence, bItsAReplay){}

	startRound(table, scoreboard){}

	winners(winners){}

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
		Upon receiving this event, the game will change the player's state from ChooseCard
		to WaitForRestToPlayTheirCard.
	*/

	/*
	Event Name:
		"playerRowToTake"
	Payload:
		{player: Player (the player playing card) , rowToTake: int (index of the row to take) }
	When it must be sent:
		The player must be in the state RoundAnimationInProgress_ExpectedToSendRowToTake.
		It is the player's responsibility to make sure that the 0 <= rowToTake <= 3
		Upon receiving this event, the game will change the player's state from RoundAnimationInProgress_ExpectedToSendRowToTake 
		to RoundAnimationInProgress.
	*/

		/*
	Event Name:
		"playerOrSpectatorDoneDisplayingRound"
	Payload:
		{player: Player (the player playing card) , bWatchAgain: bool (whether or not the player wants to rewatch the round) }
	When it must be sent:
		The player must be in the state RoundAnimationInProgress.
		The player must have received a call to its roundInfo() with the roundStepSequence last element being of AnimationType RoundDone
	*/
}