"use strict";

class GameModel {
	constructor() {
		
		// TABLE
		
		// this array must always be of the dimensions of the table. 4 rows and 6 columns. Put undefined where there is no card
		this._table = [[5,20,3,4,5, 5],
									[1,2,3,22,50, 104],
									[5,undefined,undefined,undefined,undefined, undefined],
									[1,90,3,4,45, undefined]];
		// this array must always be of the dimensions of the table. 4 rows and 6 columns. Put undefined where there is no card
		// or the card in that position should not have a player name on it.
		this._playerNamesOnTableCards = [["Nico", undefined, undefined, undefined, undefined, undefined],
												[undefined, undefined, undefined, undefined, undefined, "Judith"],
												[undefined, undefined, "Nata", undefined, undefined, undefined],
												[undefined, undefined, undefined, undefined, undefined, undefined]]; 
		this._tableState = TableState.Normal;
		this._selectedRow = undefined;
		
		// HAND
		
		this._hand = [55,20,3,4,11, 1, 32, 43];
		this._currentlySelectedCardInHand = undefined;
		this._handState = HandState.PlayCard;
		
		// UPCOMING CARDS
		
		this._UpcomingCardsFaceUp = false;
		this._upcomingCards = [4,undefined,43,55, 103, 37, 63, 24, 75, 1];
		this._playerNamesOnUpcomingCards = ["Guillo", "Nata", "Nico", "MMMMMM", "Mateo", "Erin", "Bob", "Jose", "Chris", "MMMMMM"];
		this._highlightedUpcomingCard = undefined; // every other upcoming card will be dimmed out
	}
	
	get Table() {return this._table;}
	get PlayerNamesOnTableCards() {return this._playerNamesOnTableCards;}
	get TableState() {return this._tableState;}
	set TableState(state) {this._tableState = state;}
	get SelectedRow() {return this._selectedRow}
	set SelectedRow(i) {this._selectedRow = i}
	
	get Hand() {return this._hand;}
	get CurrentlySelectedCardInHand() {return this._currentlySelectedCardInHand;}
	set CurrentlySelectedCardInHand(i) {this._currentlySelectedCardInHand = i;}
	get HandState() {return this._handState;}
	set HandState(state) {this._handState = state;}
	
	get UpcomingCardsFaceUp() {return this._UpcomingCardsFaceUp;}
	set UpcomingCardsFaceUp(b) {this._UpcomingCardsFaceUp = b;}
	get UpcomingCards() {return this._upcomingCards;}
	get PlayerNamesOnUpcomingCards() {return this._playerNamesOnUpcomingCards;}
	get HighlightedUpcomingCard() {return this._highlightedUpcomingCard;}
	set HighlightedUpcomingCard(h) {this._highlightedUpcomingCard = h;}
}
