'use strict'; 
 
module.exports = class UpcomingCards 
{ 
	constructor() 
	{
        // these two arrays should be the same length. The card and the name on the card.
        this._cards = [];
        this._namesOnCards = [];
    }
    
    get Cards() {return this._cards;}
    get NamesOnCards() {return this._namesOnCards;}
    get Size() {return this._cards.length}

    reset()
    {
        this._cards = [];
        this._namesOnCards = [];
    }

    playCard(card, name)
    {
        this._cards.push(card);
        this._namesOnCards.push(name);
    }
}