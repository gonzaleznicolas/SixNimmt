"use strict";

class GameModel {
	constructor(hand, table) {
		if (hand && hand.length != 10)
			throw "Hand must initially have 10 cards";
		if (table.length != 4 || table[0].length != 6)
			throw "Table must have exactly 4 rows and 6 columns";

		
		// TABLE
		
		// this array must always be of the dimensions of the table. 4 rows and 6 columns. Put null where there is no card
		this._table = undefined;
		
		this._tableState = TableState.Normal;
		this._selectedRow = undefined;
		
		// HAND
		
		this._hand = undefined;
		this._currentlySelectedCardInHand = undefined;
		
		// UPCOMING CARDS
		
		this._UpcomingCardsFaceUp = false;

		// these two arrays should always be the same length. the card and the name of the player who played it.
		this._upcomingCards = [];
		this._playerNamesOnUpcomingCards = [];
		this._onlyDrawUpcomingCardsAfterThisIndex = -1;
		this._highlightedUpcomingCard = undefined; // every other upcoming card will be dimmed out

		// SET INITIAL VALUES

		if (hand)
			this.Hand = hand;
		this.Table = table;
	}
	
	get Table() {return this._table;}
	set Table(table) {this._table = table;}
	get TableState() {return this._tableState;}
	set TableState(state) {this._tableState = state;}
	get SelectedRow() {return this._selectedRow}
	set SelectedRow(i) {this._selectedRow = i}
	
	get Hand() {return this._hand;}
	set Hand(hand) {this._hand = hand.sort((a, b) => a-b);}
	get CurrentlySelectedCardInHand() {return this._currentlySelectedCardInHand;}
	set CurrentlySelectedCardInHand(i) {this._currentlySelectedCardInHand = i;}
	
	get UpcomingCardsFaceUp() {return this._UpcomingCardsFaceUp;}
	set UpcomingCardsFaceUp(b) {this._UpcomingCardsFaceUp = b;}
	get UpcomingCards() {return this._upcomingCards;}
	set UpcomingCards(array) {this._upcomingCards = array}
	get PlayerNamesOnUpcomingCards() {return this._playerNamesOnUpcomingCards;}
	set PlayerNamesOnUpcomingCards(array) {this._playerNamesOnUpcomingCards = array}
	get HighlightedUpcomingCard() {return this._highlightedUpcomingCard;}
	set HighlightedUpcomingCard(h) {this._highlightedUpcomingCard = h;}
	get OnlyDrawUpcomingCardsAfterThisIndex() {return this._onlyDrawUpcomingCardsAfterThisIndex;}
	set OnlyDrawUpcomingCardsAfterThisIndex(i) {this._onlyDrawUpcomingCardsAfterThisIndex = i;}
}
