'use strict';

const Player = require('./player.js');
const PlayerStates = require('../gameGlobals.js').PlayerStates;
const RoundStepTypes = require('../gameGlobals.js').RoundStepTypes;
const Table = require('../table.js');
const ProbabilityCalculator = require('./probabilityCalculator.js');

const NUMBER_OF_ROWS = 4;

module.exports = class ArtificialPlayer extends Player
{
	constructor(name)
	{
		super(name, false);
		this._probabilityCalculator = new ProbabilityCalculator();
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
		console.log(`I am bot ${this._name} and I have to pick a card to play. My hand is ${Array.from(this._hand.Set).sort((a, b) => a-b)}`);
		console.log('The table at the start of this round looks like this:')
		console.log(table.Table);
		
		let cardToPlay;

		this._scenariosForThisRound = [];
		this.tableAtStartOfThisRound = table;
		this.calculateScenariosWhereITryToPlaceACardOnARowBeforeThe6th();
		this.calculateScenariosWhereITryToPlaceACardOnARowAfterSomeoneTakesTheRow();
		console.log(`${this._name}: my scenarios for this round: `);
		console.log(this._scenariosForThisRound);
		cardToPlay = this.getBestCardToPlay();

		this.playCard(cardToPlay);
		return;
	}

	getBestCardToPlay()
	{
		let bestCardToPlay = Math.min.apply(null , Array.from(this._hand.Set));
		if (!this._scenariosForThisRound || this._scenariosForThisRound.length < 1)
			return bestCardToPlay;
		
		let minExpectedCows = this._scenariosForThisRound[0].expectedNumCows;
		bestCardToPlay = this._scenariosForThisRound[0].cardToPlay;
		for (let i = 0; i < this._scenariosForThisRound.length; i++)
		{
			if (this._scenariosForThisRound[i].expectedNumCows < minExpectedCows)
			{
				minExpectedCows = this._scenariosForThisRound[i].expectedNumCows;
				bestCardToPlay = this._scenariosForThisRound[i].cardToPlay; 
			}
		}

		let minExpectedCowsOptions = this._scenariosForThisRound.filter( s => s.expectedNumCows == minExpectedCows);
		if (minExpectedCowsOptions.length > 1)
		{
			let killerCardsOptions = minExpectedCowsOptions.map( s => s.nKillerCardsThatCouldBePlayed);
			let leastKillerCards = Math.min.apply(null, killerCardsOptions);
			bestCardToPlay = minExpectedCowsOptions.find( s => s.nKillerCardsThatCouldBePlayed == leastKillerCards).cardToPlay;
		}


		console.log(`${this._name}: Best card to play is ${bestCardToPlay}`);
		return bestCardToPlay;
	}

	getFallbackCardToPlay()
	{
		return Math.min.apply(null , Array.from(this._hand.Set));
	}

	calculateScenariosWhereITryToPlaceACardOnARowBeforeThe6th()
	{
		this.calculateScenariosForEachRowWhereIPlayMyMaxOrMin(true);
	}

	calculateScenariosWhereITryToPlaceACardOnARowAfterSomeoneTakesTheRow()
	{
		this.calculateScenariosForEachRowWhereIPlayMyMaxOrMin(false);
	}

	// for a given row, it usually strategic to play the smallest card you have for that row.
	// sometimes though, for example when the row is almost full, you want to play your largest card
	// that would go on that row in the hope that someone else will take the row and you can just put your card
	// after theirs. So the bool parameter says: do I pick my smallest or my largest card for each row
	// true is smallest, false is largest
	calculateScenariosForEachRowWhereIPlayMyMaxOrMin(bPlayMySmallestCardForEachRow)
	{
		for (let rowI = 0; rowI < NUMBER_OF_ROWS; rowI++)
		{
			let myCardForRowI;
			if (bPlayMySmallestCardForEachRow)
				myCardForRowI = this._hand.smallestCardInRange(this.tableAtStartOfThisRound.rowRange(rowI));
			else
				myCardForRowI = this._hand.largestCardInRange(this.tableAtStartOfThisRound.rowRange(rowI));

			// if we dont have a card for this row, continue
			if (myCardForRowI == undefined)
				continue;
			
			// if we have already calculated the scenario for this card, continue
			if (this._scenariosForThisRound.findIndex( s => s.cardToPlay == myCardForRowI) != -1)
				continue;
			
			let lastCardOnRowI = this.tableAtStartOfThisRound.lastCardInRow(rowI);

			// "killer" cards are cards that would go on the same row that myCard would go on,
			// but they would go first (they are smaller)

			let listOfKillerCards = [];
			for (let c = lastCardOnRowI + 1; c < myCardForRowI; c++)
				listOfKillerCards.push(c);
			
			// remove from listOfKillerCards any card that has already been played.
			// i.e. any cards that i know no other player can play
			let listOfKillerCardsThtCouldBePlayedThisRound =
				listOfKillerCards.filter( function(card) {
					 return !this._setOfCardsIveSeenAlready.has(card);
				}.bind(this));
			
			let nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th = 5 - this.tableAtStartOfThisRound.numberOfCardsInRow(rowI);

			// we need to calculate these two variables
			let pMyCardWillBeThe6th;
			let nCowsIdTakeIfMineIsThe6th;

			pMyCardWillBeThe6th = this.calculatePMyCardWillBe6th(
				listOfKillerCardsThtCouldBePlayedThisRound.length,
				nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th
			);

			nCowsIdTakeIfMineIsThe6th = this.calc_nCowsIdTakeIfMineIsThe6th(
				rowI,
				listOfKillerCardsThtCouldBePlayedThisRound,
				nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th
			);

			

			this._scenariosForThisRound.push({
				cardToPlay: myCardForRowI,
				pMyCardWillBeThe6th: pMyCardWillBeThe6th,
				nKillerCardsThatCouldBePlayed: listOfKillerCardsThtCouldBePlayedThisRound.length,
				nCowsIdTakeIfMineIsThe6th: nCowsIdTakeIfMineIsThe6th,
				expectedNumCows: pMyCardWillBeThe6th*nCowsIdTakeIfMineIsThe6th
			});
		}
	}

	playCard(cardToPlay)
	{
		this._hand.delete(cardToPlay);
		this.emit('playerPlayCard', {player: this, playedCard: cardToPlay});
	}

	calculatePMyCardWillBe6th(nKillerCardsThtCouldBePlayedThisRound, nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th)
	{
		let pMyCardWillBeThe6th;
		let nPlayersOtherThanMe = this._totalNumberOfPlayersInGameImInIncludingMyself - 1;
		let max_n_PlayersWhoCanHaveAKillerCard = 
			Math.min(nKillerCardsThtCouldBePlayedThisRound,
				nPlayersOtherThanMe );

		// in order for my card to be the 6th, there needs to be at least nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th different players
		// in the game, all of whom have a killer card,
		// and exacly nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th need to play that card this round

		// find pMyCardWillBeThe6th iteratively by considering the different number of players who can have killer cards

		pMyCardWillBeThe6th = 0;

		// i is the number of players who have a killer card
		for (let nPWHKK = nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th;
			nPWHKK <= max_n_PlayersWhoCanHaveAKillerCard;
			nPWHKK++)
		{
			// calculate the probability that exactly nPWHKK players have a card that would go before mine.
			let p_nPWHLL_playersHaveKillerCard = this._probabilityCalculator.calc_p_H_playersHaveKillerCard(
				104 - this._setOfCardsIveSeenAlready.size,
				nKillerCardsThtCouldBePlayedThisRound,
				this._hand.Size,
				nPlayersOtherThanMe,
				nPWHKK
			);

			// calculate the probability that exactly nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th players
			// out of the nPWHKK who have a killer card play the killer card that they have

			let pAGivenPlayerPlaysTheCard = 0.8;
			let p_exactly_necessaryPlayersToMakeMine6thPlayTheirKillerCard = this._probabilityCalculator.p_outOf_N_Players_K_ChooseCard(
				nPWHKK,
				nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th,
				pAGivenPlayerPlaysTheCard
			);

			// a is the probability that nPWHKK players have killer card, and exactly nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th
			// play it
			let a = p_nPWHLL_playersHaveKillerCard*p_exactly_necessaryPlayersToMakeMine6thPlayTheirKillerCard;

			pMyCardWillBeThe6th += a;
		}

		return pMyCardWillBeThe6th;
	}

	calc_nCowsIdTakeIfMineIsThe6th(rowI, listOfKillerCardsThtCouldBePlayedThisRound, nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th)
	{
		let cowsAlreadyInRowI = this.tableAtStartOfThisRound.cowsInRow(rowI);
		let avg_nCowsOnKillerCards = averageNumberOfCowsInCardList(listOfKillerCardsThtCouldBePlayedThisRound);
		return cowsAlreadyInRowI + nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th*avg_nCowsOnKillerCards;

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
		// only add upcoming cards to cards ive seen once everyone has played their card. i.e.
		// at the moment when the cards are flipped, when in reality a player would see
		// what cards were played
		if (upcomingCards.length == this._totalNumberOfPlayersInGameImInIncludingMyself)
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

function averageNumberOfCowsInCardList(cardList)
{
	let totalCows = 0;
	cardList.forEach( function(cardNumber) {
		if (cardNumber != null)
			totalCows = totalCows + getCardCows(cardNumber);
	});
	return cardList.length == 0 ? 0 : totalCows/cardList.length;
}

function getCardCows(cardNumber)
{
	if (cardNumber === 55)
		return 7;
	else if ( cardNumber % 11 === 0)
		return 5;
	else if (cardNumber % 10 === 0)
		return 3;
	else if (cardNumber % 5 === 0)
		return 2;
	else
		return 1;
}