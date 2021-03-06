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

			// remove whichever of the rows i have the least cards for
			let cardsInRow = rowsWithFewestCows.map(function(rowI){
				return {rowI: rowI, nCards: this._hand.numberOfCardsInRange(tableObj.rowRange(rowI))};
			}.bind(this));

			let index = cardsInRow.length - 1;
			for (let i = cardsInRow.length - 1; i >= 0; i--)
			{
				if (cardsInRow[i].nCards < cardsInRow[index].nCards)
					index = i;
			}
			rowToTakeIndex = cardsInRow[index].rowI;

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
		table.printTable();
		
		let cardToPlay;

		this._scenariosForThisRound = [];
		this.tableAtStartOfThisRound = table;
		this.calculateScenariosWhereIPlaySmallerThanTheLastOnFirstRow();
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
		 
		if (bestCardToPlay < 7 &&  this.tableAtStartOfThisRound.minNumberOfCowsInARow() == 1)
			return bestCardToPlay; // get rid of small cards when there is a small row to take
		
		this._scenariosForThisRound.sort( function(a,b){
			if (a.expectedNumCows != b.expectedNumCows)
				return a.expectedNumCows - b.expectedNumCows;
			else if (a.nKillerCardsThatCouldBePlayed == undefined)
				return 1;
			else if (b.nKillerCardsThatCouldBePlayed == undefined)
				return -1;
			else if (a.nKillerCardsThatCouldBePlayed != b.nKillerCardsThatCouldBePlayed)
				return a.nKillerCardsThatCouldBePlayed - b.nKillerCardsThatCouldBePlayed;
			else
				return a.cardToPlay - b.cardToPlay;
		});

		bestCardToPlay = this._scenariosForThisRound[0].cardToPlay;

		console.log(`${this._name}: Best card to play is ${bestCardToPlay}`);
		return bestCardToPlay;
	}

	calculateScenariosWhereIPlaySmallerThanTheLastOnFirstRow()
	{
		let myCard = this._hand.smallestCardInRange(this.tableAtStartOfThisRound.smallerThanLastCardOnFirstRowRange());

		if (myCard == undefined)
			return;

		// we need to calculate these two variables
		let pIllHaveToChooseRow;
		let nCowsIdTakeIfIHaveToChooseRow; // nCows in row with least cows (row id choose to take)

		pIllHaveToChooseRow = this.calculatePIllHaveToChooseRow(myCard);
		nCowsIdTakeIfIHaveToChooseRow = this.tableAtStartOfThisRound.minNumberOfCowsInARow();

		this._scenariosForThisRound.push({
			cardToPlay: myCard,
			pIllHaveToChooseRow: pIllHaveToChooseRow,
			nCowsIdTakeIfIHaveToChooseRow: nCowsIdTakeIfIHaveToChooseRow,
			expectedNumCows: pIllHaveToChooseRow*nCowsIdTakeIfIHaveToChooseRow
		});
	}

	calculatePIllHaveToChooseRow(cardPlayed)
	{
		let pSomeonePlaysSomethingSmaller;

		let listOfSmallerCards = [];
		for (let c = 1; c < cardPlayed; c++)
			listOfSmallerCards.push(c);

		// remove from listOfSmallerCards any card that has already been played.
		// i.e. any cards that i know no other player can play
		let listOfSmallerCardsThatCouldBePlayedThisRound =
			listOfSmallerCards.filter( function(card) {
				return !this._setOfCardsIveSeenAlready.has(card);
			}.bind(this));
		
		let nPlayersOtherThanMe = this._totalNumberOfPlayersInGameImInIncludingMyself - 1;
		let max_n_PlayersWhoCanHaveASmallerCard = 
			Math.min(listOfSmallerCardsThatCouldBePlayedThisRound.length,
				nPlayersOtherThanMe );
		
		// in order for someone to play something smaller, between 1 and nPlayersOtherThanMe need to have a smallerCard
		// in any case at least one needs to play that smaller card

		pSomeonePlaysSomethingSmaller = 0;

		// nPWHSC is the number of players who have a smaller card
		for (let nPWHSC = 1;
			nPWHSC <= max_n_PlayersWhoCanHaveASmallerCard;
			nPWHSC++)
		{
			// calculate the probability that exactly nPWHKK players have a card that would go before mine.
			let p_nPWHSC_playersHaveSmallerCard = this._probabilityCalculator.calc_p_H_playersHaveSpecialCard(
				104 - this._setOfCardsIveSeenAlready.size,
				listOfSmallerCardsThatCouldBePlayedThisRound.length,
				this._hand.Size,
				nPlayersOtherThanMe,
				nPWHSC
			);

			// calculate the probability that at least 1 player
			// out of the nPWHSC who have a smaller card play the smaller card that they have

			let pAGivenPlayerPlaysTheCard = 0.1;
			let pNoOnePlaysCard = Math.pow(1-pAGivenPlayerPlaysTheCard, nPWHSC);
			let p_atLeastOnePlaysCard = 1 - pNoOnePlaysCard;

			// a is the probability that nPWHSC players have smaller card card, and at least one plays it
			let a = p_nPWHSC_playersHaveSmallerCard*p_atLeastOnePlaysCard;

			pSomeonePlaysSomethingSmaller += a;
		}

		let pIllHaveToChooseRow = 1 - pSomeonePlaysSomethingSmaller;

		return pIllHaveToChooseRow;
		
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
			{
				if (this.tableAtStartOfThisRound.numberOfCardsInRow(rowI) < 5)
					continue;
				myCardForRowI = this._hand.largestCardInRange(this.tableAtStartOfThisRound.rowRange(rowI));
				// if i also have the card immediately before this one, then i might as well play that smaller one. It
				// has the same chance of everything, but it sets me up better for the next turn
				while (this._hand.has(myCardForRowI - 1))
					myCardForRowI--;

			}

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

		// nPWHKK is the number of players who have a killer card
		for (let nPWHKK = nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th;
			nPWHKK <= max_n_PlayersWhoCanHaveAKillerCard;
			nPWHKK++)
		{
			// calculate the probability that exactly nPWHKK players have a card that would go before mine.
			let p_nPWHKK_playersHaveKillerCard = this._probabilityCalculator.calc_p_H_playersHaveSpecialCard(
				104 - this._setOfCardsIveSeenAlready.size,
				nKillerCardsThtCouldBePlayedThisRound,
				this._hand.Size,
				nPlayersOtherThanMe,
				nPWHKK
			);

			// calculate the probability that exactly nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th players
			// out of the nPWHKK who have a killer card play the killer card that they have

			let numberOfCardsAlreadyOnRow = 5 - nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th;

			let pAGivenPlayerPlaysTheCard = this.pOthersWillPlayCard(numberOfCardsAlreadyOnRow);
			let p_exactly_necessaryPlayersToMakeMine6thPlayTheirKillerCard = this._probabilityCalculator.p_outOf_N_Players_K_ChooseCard(
				nPWHKK,
				nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th,
				pAGivenPlayerPlaysTheCard
			);

			// a is the probability that nPWHKK players have killer card, and exactly nCardsThatWouldHaveToBePlacedBeforeMineToMakeMineThe6th
			// play it
			let a = p_nPWHKK_playersHaveKillerCard*p_exactly_necessaryPlayersToMakeMine6thPlayTheirKillerCard;

			pMyCardWillBeThe6th += a;
		}

		return pMyCardWillBeThe6th;
	}

	// assumning a player has a card that would go on that row, what is the probability that they will play it?
	pOthersWillPlayCard(nCardsOnRow)
	{
		if (nCardsOnRow < 4)
			return 0.8;
		if (nCardsOnRow == 4)
			return 0.6;
		else
			return 0.07;
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