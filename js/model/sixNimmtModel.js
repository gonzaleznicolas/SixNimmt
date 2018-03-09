"use strict";

class SixNimmtModel {
	constructor() {
		this._table = [[55,20,3,4,undefined, undefined],
									[1,2,3,22,50, undefined],
									[1,65,3,66,undefined, undefined],
									[1,90,3,4,undefined, undefined]];
		this._playerNamesOnTableCards = [["Nico", undefined, undefined, undefined, undefined, undefined],
												[undefined, undefined, undefined, undefined, undefined, undefined],
												[undefined, undefined, "Nata", undefined, undefined, undefined],
												[undefined, undefined, undefined, undefined, undefined, undefined]];
		
		this._hand = [55,20,3,4,11, 1, 32, 43];
									
		this._upcomingCards = [1,32,43,55, 63, 37, 73, 24, 75, 1];
		this._playerNamesOnUpcomingCards = ["Guillo", "Nata", "Nico", "MMMMMM", "Mateo", "Erin", "Bob", "Jose", "Chris", "MMMMMM"];
	}
	
	get Table() {return this._table;}
	get PlayerNamesOnTableCards() {return this._playerNamesOnTableCards;}
	get Hand() {return this._hand;}
	
	get UpcomingCards() {return this._upcomingCards;}
	get PlayerNamesOnUpcomingCards() {return this._playerNamesOnUpcomingCards;}
}
