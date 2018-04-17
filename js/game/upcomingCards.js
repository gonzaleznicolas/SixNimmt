'use strict'; 
 
module.exports = class UpcomingCards 
{ 
	constructor() 
	{
        // these two arrays should be the same length. The card and the name on the card.
        this._cards = [];
    }

    static clone(upcomingCardsObj)
	{
		let originalArray = upcomingCardsObj.Cards;
		let cloneArray = [];
		for (let i = 0; i < originalArray.length; i++)
		{
            if (originalArray[i])
                cloneArray[i] = {number: originalArray[i].number, name: originalArray[i].name};
            else
              cloneArray[i] = null;
		}

		let clone = new UpcomingCards();
		clone.Cards = cloneArray;
		return clone;
	}
    
    get Cards() {return this._cards;}
    set Cards(cards) {this._cards = cards;}
    get Size() {return this._cards.length;}

    reset()
    {
        this._cards = [];
    }

    sort()
    {
        this._cards.sort((a, b) => a.number - b.number);
    }

    playCard(number, name)
    {
        this._cards.push({number: number, name: name});
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

    // returns a bool whether the specified player has a card in the upcoming cards
    playerHasPlayedACard(name)
    {
        return this._cards.some( (card) => card.name == name );
    }

    // if there is an upcoming card with the given oldName, this method changes it to newName
	renamePlayer(oldName, newName)
	{
		let card = this._cards.find( (card) => card.name == oldName);
		if (card)
		{
			card.name = newName;
		}
	}
}