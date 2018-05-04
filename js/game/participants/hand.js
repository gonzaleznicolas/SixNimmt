'use strict'; 
 
module.exports = class Hand 
{ 
	constructor() 
	{
		this._set = undefined;
	}

	get Set() { return this._set;}
	set Set(set) {
		if (! set instanceof Set)
			throw 'You cant set the Hand\'s set to an object that is not a Set';
		this._set = set;
	}
	get Size() {return this._set.size}

	delete(card)
	{
		this._set.delete(card);
	}

	has(card)
	{
		return this._set.has(card);
	}

	// range is an object {min: , max: } where min and max are non inclusive.
	// this function does not modify the hand. It just returns a card in the hand
	// which is the smallest in the given range.
	// returns undefined if the hand contains no card for the given range
	smallestCardInRange(range)
	{
		let handArray = Array.from(this._set);
		let cardsInRange = handArray.filter( function(card) {return card > range.min && card < range.max;});
		if (cardsInRange.length == 0)
			return undefined;
		return Math.min.apply(null, cardsInRange);			
	}

	largestCardInRange(range)
	{
		let handArray = Array.from(this._set);
		let cardsInRange = handArray.filter( function(card) {return card > range.min && card < range.max;});
		if (cardsInRange.length == 0)
			return undefined;
		return Math.max.apply(null, cardsInRange);			
	}
}