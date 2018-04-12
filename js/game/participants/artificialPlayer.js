'use strict';

const Player = require('./player.js');
const PlayerStates = require('./playerStates.js');

module.exports = class ArtificialPlayer extends Player
{
	constructor(name)
	{
		super(name, false);
	}

	// override the Player State setter
	set State(state) {
		this._state = state;
		if (this._state == PlayerStates.ChooseCard)
		{
			let secondsToWaitBeforeSelectingCard = Math.floor(Math.random() * (20-10)) + 10;
			setTimeout(this.playACard.bind(this), secondsToWaitBeforeSelectingCard*1000);
		}
	}
	get State() {return this._state;} // if you override the setter you have to override the getter as well

	// METHODS CALLED FROM WITHIN THE HumanPlayer

	playACard()
	{
		if (this._hand.size == 0)
		{
			console.log(`Artificial player ${this._name}: Cannot play a card. I have 0 cards left in my hand.`);
		}
		let cardToPlay = Array.from(this._hand)[0];
		this._hand.delete(cardToPlay);
		this.emit('playerPlayCard', {player: this, playedCard: cardToPlay});
	}

	// METHODS CALLED BY THE GAME. METHODS ANY PLAYER MUST IMPLEMENT

	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}
	startGame(playerList, gameBoard){}
	updateUpcomingCards(cards, namesOnCards){}
	run(runObject){}
}