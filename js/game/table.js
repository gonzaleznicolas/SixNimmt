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

	static clone(tableObj)
	{
		let originalArray = tableObj.Table;
		let cloneArray = [];
		for (let row = 0; row < originalArray.length; row++)
		{
			cloneArray[row] = originalArray[row].slice(0);
		}

		let clone = new Table();
		clone.Table = cloneArray;
		return clone;
	}

	get Table() {return this._table;}
	set Table(table) {this._table = table}

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
		if (rowI >= NUMBER_OF_ROWS)
			throw "You are trying to access a row which doesnt exist";
		let row = this._table[rowI];
		if (row[0] == null)
			throw "This row is empty. It has no last card."
		let indexOfFirstNull = this._table[rowI].findIndex( (e) => e == null);
		if (indexOfFirstNull == -1) // the row is full
			return row[row.length-1];
		return row[indexOfFirstNull-1]
	}

	// -1 if the next open position is the 7th (index 6) row
	nextOpenPositionInRow(row)
	{
		return this._table[row].findIndex( (e) => e == null);
	}

	// returns the col that the card was put in
	addCardToRow(card, row)
	{
		let col = this.nextOpenPositionInRow(row);
		if (col == -1)
			throw "Attempting to add a card to a full row";
		this._table[row][col] = card;
		return col;
	}

	cardSmallerThanLastCardInFirstRow(card)
	{
		return card < this.lastCardInRow(0);
	}

	// precondition: the card must not be smaller than the last card on the first row.
	//               Check that before calling this function
	// returns the {row: , col: } that this card was put in, and updates the table
	playCard(card)
	{
		let rowToPlaceThisCardIn;
		for ( let row = 0; row < NUMBER_OF_ROWS; row++)
		{
			rowToPlaceThisCardIn = row;
			if ( card < this.lastCardInRow(row))
			{
				rowToPlaceThisCardIn = row - 1;
				break;
			}
		}
		let colThisCardWasPlacedIn = this.addCardToRow(card, rowToPlaceThisCardIn);
		return {row: rowToPlaceThisCardIn, col: colThisCardWasPlacedIn};
	}
}

