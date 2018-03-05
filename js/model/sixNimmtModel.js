"use strict";

class SixNimmtModel {
	constructor() {
		this._table = [[55,20,3,4,undefined, undefined],
									[1,2,3,22,undefined, undefined],
									[1,65,3,66,undefined, undefined],
									[1,90,3,4,undefined, undefined]];
		
		this._hand = [[55,20,3,4,11],
									[1,20,3,undefined,undefined]];
	}
	
	get table() {return this._table;}
	get hand() {return this._hand;}
}
