'use strict'; 
 
module.exports = class Deck 
{ 
	constructor() 
	{
		this.reset();
	}

	reset()
	{
		this._cards = [];
		for (let card = 1; card <= 104; card++)
		{
			this._cards.push(card);
		}
	}

	// returns a set with n cards from the deck and removes those cards from the deck
	takeCards(n)
	{
		let cards = new Set();
		let randomCardInDeck;
		let randomIndexInDeck;
		for (let i = 0; i < n; i++)
		{
			randomIndexInDeck = Math.floor(Math.random() * (this._cards.length));
			randomCardInDeck = this._cards[randomIndexInDeck];
			this._cards.splice(randomIndexInDeck, 1);
			cards.add(randomCardInDeck);
		}
		return cards;
	}
}