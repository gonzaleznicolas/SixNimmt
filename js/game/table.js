'use strict'; 
 
const NUMBER_OF_ROWS = 4;
const NUMBER_OF_COLS = 6;

module.exports = class Table 
{ 
	constructor() 
	{
		this._table = undefined;
		this.initEmptyTable();
	}

	get Table() {return this._table;}

	initEmptyTable()
	{
		this._table = [];
		for (let row = 0; row < NUMBER_OF_ROWS; row++)
		{
			this._table[row] = [];
			for (let col = 0; col < NUMBER_OF_COLS; col++)
			{
				this._table[row][col] = null;
			}
		}
	}

	setInitialFourCards(unsortedArrayOfFourCards)
	{
		if (unsortedArrayOfFourCards.length != 4)
			throw "Need exactly 4 initial cards on the table";
		let sortedAscending = unsortedArrayOfFourCards.sort((a, b) => a-b);
		for (let row = 0; row < NUMBER_OF_ROWS; row++)
		{
			this._table[row][0] = sortedAscending[row];
		}
	}

	lastCardInRow(rowI)
	{
		let row = this._table[rowI];
		for (let c = 0; c < row.length ; c++)
		{
			if (row[c] == null)
				break;
		}
		return c;
	}
}