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
}