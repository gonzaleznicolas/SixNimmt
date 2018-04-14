'use strict';

const Player = require('./player.js');
const PlayerStates = require('../gameGlobals.js').PlayerStates;
const RoundStepTypes = require('../gameGlobals.js').RoundStepTypes;

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
			let secondsToWaitBeforeSelectingCard = Math.floor(Math.random() * (2-4)) + 2; // increase the wait time later. TEMP
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
		let cardToPlay = Math.min.apply(null , Array.from(this._hand));
		this._hand.delete(cardToPlay);
		this.emit('playerPlayCard', {player: this, playedCard: cardToPlay});
	}

	// METHODS CALLED BY THE GAME. METHODS ANY PLAYER MUST IMPLEMENT

	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}

	// from the game board, see which cards are there and start to keep track of which cards have already come up
	startGame(playerList, gameBoard){}

	updateUpcomingCards(upcomingCards){}

	// from this animationSequence, the artifical player must extract the information that it needs.
	// The animation sequence always ends with either an animatino of type AskPlayerToChooseARowToTake
	// or an animation sayin the round ended
	// If the last animation is of type AskPlayerToChooseARowToTake, the artificial player must check if its
	// itself that must choose a row to take, and in that case raise the event necessary to let the game know
	// which row it wants to take
	animate(animationSequence)
	{
		let lastAnimation = animationSequence[animationSequence.length - 1];
		if (lastAnimation.animationType == RoundStepTypes.AskPlayerToChooseARowToTake &&
			lastAnimation.animationParams.nameOfPlayerToChooseRow == this._name &&
			this._state == PlayerStates.RoundAnimationInProgress_ExpectedToSendRowToTake)
		{
			this.emit('playerRowToTake', {player: this, rowToTakeIndex: 2});
		}
	}
}