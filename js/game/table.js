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

	reset()
	{
		this.initEmptyTable();
	}

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

	// CHECKS

	getCardCows(cardNumber)
	{
		if (cardNumber === 55)
			return 7;
		else if ( cardNumber % 11 === 0)
			return 5;
		else if (cardNumber % 10 === 0)
			return 3;
		else if (cardNumber % 5 === 0)
			return 2;
		else
			return 1;
	}

	cowsInRow(rowI)
	{
		if (rowI < 0 || rowI >=4)
			throw "Row index out of bounds";
		let totalCows = 0;
		this._table[rowI].forEach( function(cardNumber) {
			if (cardNumber != null)
				totalCows = totalCows + this.getCardCows(cardNumber);
		}.bind(this));
		return totalCows;
	}

	// returns an array of row indices. Any index in this array, that row is tied for having least cows
	listOfRowsWithFewestCows()
	{
		let cowsInEachRow = [0, 1, 2, 3].map( function(rowI) {
			return this.cowsInRow(rowI);
		}.bind(this));
		let minNumberOfCowsInARow = Math.min.apply(null, cowsInEachRow);

		let listOfRowIndicesTiedForFewestCows = [0, 1, 2, 3].filter( function(rowI){
			return this.cowsInRow(rowI) == minNumberOfCowsInARow;
		}.bind(this));

		return listOfRowIndicesTiedForFewestCows;
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

	// -1 if the row is full (all six rows are full)
	nextOpenPositionInRow(row)
	{
		return this._table[row].findIndex( (e) => e == null);
	}

	cardSmallerThanLastCardInFirstRow(card)
	{
		return card < this.lastCardInRow(0);
	}

	// ACTIONS

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

	// returns the col that the card was put in
	addCardToRow(card, row)
	{
		let col = this.nextOpenPositionInRow(row);
		if (col == -1)
			throw "Attempting to add a card to a full row";
		this._table[row][col] = card;
		return col;
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

	// replaces a row with a row full of nulls
	// returns the number of cows that were in that row
	emptyRow(rowI)
	{
		if (rowI < 0 || rowI >=4)
			throw "Trying to empty row out of bounds";
		let numCows = this.cowsInRow(rowI);
		this._table[rowI] = [null, null, null, null, null, null];
		return numCows;
	}

	// deletes a row, shifts down any rows above it, and places a row full of nulls in the 0th row
	// returns {fromRow: , toRow: , downThisManyRows: } where using the indices from before the remove,
	// fromRow is the first row that needs to be moved down and toRow is the last that needs to be moved down
	// by downThisManyRows
	deleteRow(rowI)
	{
		if (rowI < 0 || rowI >=4)
			throw "Trying to delete row out of bounds";

		let topRowAfter = [null, null, null, null, null, null];

		let fromRow = 0;
		let toRow = rowI - 1;
		let downThisManyRows = rowI == 0 ? 0 : 1;
		this._table.splice(rowI, 1);
		this._table.unshift(topRowAfter);

		return {fromRow: fromRow, toRow: toRow, downThisManyRows: downThisManyRows};
	}

	// precondition: the 0th row must be empty. full of nulls.
	putCardInEmptyFirstsRow(card)
	{
		if ( this._table[0][0] != null)
			throw "The first row must be empty to perform this operation";
		this._table[0][0] = card.number;
	}

	// given a full row, this method leaves the 6th card in the first position with the rest of the positions with null
	// returns the number of cows that were in the first 5 cards of the row before taking the row
	takeFullRow(rowI)
	{
		if (rowI < 0 || rowI >=4)
			throw "Row index out of bounds";
		if (this.nextOpenPositionInRow(rowI) != -1)
			throw "This row is not full";
		
		let sixthCard = this._table[rowI][5];
		this._table[rowI][5] = null; // temporarily to get number of cows before
		let numCows = this.cowsInRow(rowI);
		
		this._table[rowI] = [sixthCard, null, null, null, null, null];

		return numCows;
	}
}

