'use strict';

const Player = require('./player.js');
const PlayerStates = require('../gameGlobals.js').PlayerStates;
const RoundStepTypes = require('../gameGlobals.js').RoundStepTypes;
const Table = require('../table.js');

const NUMBER_OF_ROWS = 4;

module.exports = class ArtificialPlayer extends Player
{
	constructor(name)
	{
		super(name, false);
	}

	// METHODS CALLED FROM WITHIN THE ArtificialPlayer

	// will only read the table2dArray. Not modify.
	chooseARowToTake(table2dArray)
	{
		let secondsToWaitBeforeChoosingRow = Math.floor(Math.random() * (4-6)) + 4;
		setTimeout( function() {

			let rowToTakeIndex = 0;
			let tableObj = new Table();
			tableObj.Table = table2dArray;
			let rowsWithFewestCows = tableObj.listOfRowsWithFewestCows();

			console.log(rowsWithFewestCows);

			rowToTakeIndex = rowsWithFewestCows[0];

			console.log(rowToTakeIndex);

			console.log(`${this._name} emits playerRowToTake`);
			this.emit('playerRowToTake', {player: this, rowToTakeIndex: rowToTakeIndex});

		}.bind(this), secondsToWaitBeforeChoosingRow);
	}

	sayDoneDisplayingRound()
	{
		let secondsToWait = Math.floor(Math.random() * (4-6)) + 4;
		setTimeout( function() {

			console.log(`${this._name} emits playerOrSpectatorDoneDisplayingRound`);
			this.emit("playerOrSpectatorDoneDisplayingRound", {participant: this, bWatchAgain: false});

		}.bind(this), secondsToWait);
	}

	playACardNow(table)
	{
		console.log(`I am bot ${this._name} and I have to pick a card to play. My hand is ${Array.from(this._hand.Set)}`);
		let cardToPlay = Math.min.apply(null , Array.from(this._hand.Set));

		this.scenariosForThisRound = [];
		this.tableAtStartOfThisRound = table;
		this.calculateScenariosWhereITryToPlaceACardOnARowBeforeThe6th();


		this.playCard(cardToPlay);
		return;
	}

	calculateScenariosWhereITryToPlaceACardOnARowBeforeThe6th()
	{
		for (let rowI = 0; rowI < NUMBER_OF_ROWS; rowI++)
		{
			let myCardForRowI = this._hand.smallestCardInRange(this.tableAtStartOfThisRound.rowRange(rowI));
			if (myCardForRowI == undefined)
				continue;
			let lastCardOnRowI = this.tableAtStartOfThisRound.lastCardInRow(rowI);

			let listOfCardsThatWouldGoBeforeMine = [];
			for (let c = lastCardOnRowI + 1; c < myCardForRowI; c++)
				listOfCardsThatWouldGoBeforeMine.push(c);
			
			// remove from listOfCardsThatWouldGoBeforeMine any card that has already been played.
			// i.e. any cards that i know no other player can play
			let listOfCardsThatCouldBePlayedThisTurnThatWouldGoOnRowIBeforeMyCard =
				listOfCardsThatWouldGoBeforeMine.filter( function(card) {
					 return !this._setOfCardsIveSeenAlready.has(card);
				}.bind(this));
			
			let numberOfCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th = 5 - this.tableAtStartOfThisRound.numberOfCardsInRow(rowI);

			// we need to calculate these two variables
			let probabilityThatMyCardWillBeThe6th;
			let numberOfCowsIdTakeIfMineIsThe6th;

			// calculate probabilityThatMyCardWillBeThe6th:

			// in order for my card to be the 6th, there needs to be at least numberOfCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th different players
			// in the game, all of whom have a card in their hand in listOfCardsThatCouldBePlayedThisTurnThatWouldGoOnRowIBeforeMyCard,
			// and exacly numberOfCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th need to play that card this turn

			if (Math.min(listOfCardsThatCouldBePlayedThisTurnThatWouldGoOnRowIBeforeMyCard.length, this._totalNumberOfPlayersInGameImInIncludingMyself)
				< numberOfCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th)
			{
				probabilityThatMyCardWillBeThe6th = 0;
			}
			else
			{
				// there are enough CardsThatCouldBePlayedThisTurnThatWouldGoOnRowIBeforeMyCard and enough players 
				// so that they could all play cards making mine the 6th

			}

			scenariosForThisRound.push({cardToPlay: myCardForRowI, expectedNumCows: probabilityThatMyCardWillBeThe6th*numberOfCowsIdTakeIfMineIsThe6th});
		}
	}

	playCard(cardToPlay)
	{
		this._hand.delete(cardToPlay);
		this.emit('playerPlayCard', {player: this, playedCard: cardToPlay});
	}

	// METHODS CALLED BY THE GAME. METHODS ANY PLAYER MUST IMPLEMENT
	removeAllListeners(){}
	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}

	// from the game board, see which cards are there and start to keep track of which cards have already come up
	startGame(playerList, table)
	{
		this.resetSetOfCardsIveSeenAlreadyForNewIteration(table);
	}

	updateUpcomingCards(upcomingCards)
	{
		this.addCardsFromUpcomingCardsToSetOfCardsIveSeenAlready(upcomingCards);
	}

	// from this roundStepSequence, the artifical player must extract the information that it needs.
	// The step sequence always ends with either a step of type AskPlayerToChooseARowToTake
	// or a step RoundDone
	// If the last step is of type AskPlayerToChooseARowToTake, the artificial player must check if its
	// itself that must choose a row to take, and in that case raise the event necessary to let the game know
	// which row it wants to take
	// If the last step is RoundDone, the artificial player must raise an event telling the game that it is
	// done displaying the round. I.e. the next round can start at any time.
	roundInfo(roundStepSequence, bItsAReplay)
	{
		let lastAnimation = roundStepSequence[roundStepSequence.length - 1];

		if (lastAnimation.stepType == RoundStepTypes.AskPlayerToChooseARowToTake &&
			lastAnimation.stepParams.nameOfPlayerToChooseRow == this._name &&
			this._state == PlayerStates.RoundAnimationInProgress_ExpectedToSendRowToTake)
		{
			this.chooseARowToTake(lastAnimation.tableImage.table);
		}
		else if (lastAnimation.stepType == RoundStepTypes.RoundDone)
		{
			this.sayDoneDisplayingRound();
		}
	}

	startRound(table, scoreboard){}
	winners(winners){}

	kickOut(){}

	// will only read the table2dArray. Not modify.
	playACard(table2dArray)
	{
		if (this._state != PlayerStates.ChooseCard)
		{
			console.log('playACard was called on player '+this._name+" when not in state ChooseCard. Ignored.");
			return;
		}
		if (this._hand.Size == 0)
		{
			console.log(`Artificial player ${this._name}: Cannot play a card. I have 0 cards left in my hand.`);
			return;
		}

		let secondsToWaitBeforeSelectingCard = Math.floor(Math.random() * (8-15)) + 8;
		setTimeout(function ()
		{
			let tableObj = new Table();
			tableObj.Table = table2dArray;
			this.playACardNow(Table.clone(tableObj));
		}.bind(this), secondsToWaitBeforeSelectingCard * 1000);
	}
}