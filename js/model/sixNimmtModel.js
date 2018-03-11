"use strict";

class SixNimmtModel {
	constructor() {
		
		// TABLE
		
		// this array must always be of the dimensions of the table. 4 rows and 6 columns. Put undefined where there is no card
		this._table = [[5,20,3,4,undefined, undefined],
									[1,2,3,22,50, 104],
									[1,65,3,66,undefined, undefined],
									[1,90,3,4,45, undefined]];
		// this array must always be of the dimensions of the table. 4 rows and 6 columns. Put undefined where there is no card
		// or the card in that position should not have a player name on it.
		this._playerNamesOnTableCards = [["Nico", undefined, undefined, undefined, undefined, undefined],
												[undefined, undefined, undefined, undefined, undefined, "Judith"],
												[undefined, undefined, "Nata", undefined, undefined, undefined],
												[undefined, undefined, undefined, undefined, undefined, undefined]];
		
		
		// HAND
		
		this._hand = [55,20,3,4,11, 1, 32, 43];
		this._currentlySelectedCardInHand = undefined;
		this._handState = HandState.PlayCard;
		
		// UPCOMING CARDS
		
		this._UpcomingCardsFaceUp = false;
		this._upcomingCards = [4,32,43,55, 103, 37, 63, 24, 75, 1];
		this._playerNamesOnUpcomingCards = ["Guillo", "Nata", "Nico", "MMMMMM", "Mateo", "Erin", "Bob", "Jose", "Chris", "MMMMMM"];
		this._upcomingCardsCurrentlyInAnimation = []; // list of cards in animation: i.e. dont draw them on draw()
	}
	
	get Table() {return this._table;}
	get PlayerNamesOnTableCards() {return this._playerNamesOnTableCards;}
	
	get Hand() {return this._hand;}
	get CurrentlySelectedCardInHand() {return this._currentlySelectedCardInHand;}
	set CurrentlySelectedCardInHand(i) {this._currentlySelectedCardInHand = i;}
	get HandState() {return this._handState;}
	set HandState(state) {this._handState = state;}
	
	get UpcomingCardsFaceUp() {return this._UpcomingCardsFaceUp;}
	set UpcomingCardsFaceUp(b) {this._UpcomingCardsFaceUp = b;}
	get UpcomingCards() {return this._upcomingCards;}
	get PlayerNamesOnUpcomingCards() {return this._playerNamesOnUpcomingCards;}
	get UpcomingCardsCurrentlyInAnimation() {return this._upcomingCardsCurrentlyInAnimation;}
	set UpcomingCardsCurrentlyInAnimation(c) {this._upcomingCardsCurrentlyInAnimation = c};
}
