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
			this.playACard();
	}
	get State() {return this._state;} // if you override the setter you have to override the getter as well

	// METHODS CALLED FROM WITHIN THE HumanPlayer

	playACard()
	{
		let secondsToWaitBeforeSelectingCard = Math.floor(Math.random() * (8-15)) + 8;
		setTimeout(function () {

			if (this._hand.size == 0)
			{
				console.log(`Artificial player ${this._name}: Cannot play a card. I have 0 cards left in my hand.`);
				return;
			}
			let cardToPlay = Math.min.apply(null , Array.from(this._hand));
			//let cardToPlay = Array.from(this._hand)[0];
			//let cardToPlay = Math.max.apply(null , Array.from(this._hand));
			this._hand.delete(cardToPlay);
			this.emit('playerPlayCard', {player: this, playedCard: cardToPlay});

		}.bind(this), secondsToWaitBeforeSelectingCard * 1000);
	}

	// METHODS CALLED BY THE GAME. METHODS ANY PLAYER MUST IMPLEMENT

	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}

	// from the game board, see which cards are there and start to keep track of which cards have already come up
	startGame(playerList, gameBoard){}

	updateUpcomingCards(upcomingCards){}

	// from this roundStepSequence, the artifical player must extract the information that it needs.
	// The step sequence always ends with either a step of type AskPlayerToChooseARowToTake
	// or a step RoundDone
	// If the last step is of type AskPlayerToChooseARowToTake, the artificial player must check if its
	// itself that must choose a row to take, and in that case raise the event necessary to let the game know
	// which row it wants to take
	// If the last step is RoundDone, the artificial player must raise an event telling the game that it is
	// done displaying the round. I.e. the next round can start at any time.
	roundInfo(roundStepSequence)
	{
		let secondsToWaitBeforeReacting = Math.floor(Math.random() * (5-8)) + 8;
		setTimeout(function () {

			let lastAnimation = roundStepSequence[roundStepSequence.length - 1];

			if (lastAnimation.stepType == RoundStepTypes.AskPlayerToChooseARowToTake &&
				lastAnimation.stepParams.nameOfPlayerToChooseRow == this._name &&
				this._state == PlayerStates.RoundAnimationInProgress_ExpectedToSendRowToTake)
			{
				console.log(`${this._name} emits playerRowToTake`);
				this.emit('playerRowToTake', {player: this, rowToTakeIndex: 2});
			}
			else if (lastAnimation.stepType == RoundStepTypes.RoundDone)
			{
				console.log(`${this._name} emits playerOrSpectatorDoneDisplayingRound`);
				this.emit("playerOrSpectatorDoneDisplayingRound", this);
			}

		}.bind(this), secondsToWaitBeforeReacting * 1000);
	}

	startRound(table, scoreboard){}
}