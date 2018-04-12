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

    // returns next upcoming card. Does not remove the card.
    next()
    {
        let card = undefined;
        for (let i = 0; i < this._cards.length; i++)
        {
            if (this._cards[i] != undefined && this._cards[i] != null)
            {
                card = this._cards[i];
                break;
            }
        }
        return card;
    }
}