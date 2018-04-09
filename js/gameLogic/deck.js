'use strict'; 
 
module.exports = class Deck 
{ 
	constructor() 
	{
		this._cards = [];
		for (let card = 1; card <= 104; card++)
		{
			this._cards.push(card);
		}
	}

	// returns a set with 10 cards from the deck and removes those cards from the deck
	getAHand()
	{
		let hand = new Set();
		let randomCardInDeck;
		let randomIndexInDeck;
		for (let i = 0; i < 10; i++)
		{
			randomIndexInDeck = Math.floor(Math.random() * (this._cards.length));
			randomCardInDeck = this._cards[randomIndexInDeck];
			this._cards.splice(randomIndexInDeck, 1);
			hand.add(randomCardInDeck);
		}
		return hand;
	}
}