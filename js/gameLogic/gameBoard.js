'use strict'; 
 
const NUMBER_OF_ROWS = 4;
const NUMBER_OF_COLS = 6;

module.exports = class GameBoard 
{ 
	constructor() 
	{
		this._board = undefined;
		this.initEmptyBoard();
	}

	get Board() {return this._board;}

	initEmptyBoard()
	{
		this._board = [];
		for (let row = 0; row < NUMBER_OF_ROWS; row++)
		{
			this._board[row] = [];
			for (let col = 0; col < NUMBER_OF_COLS; col++)
			{
				this._board[row][col] = null;
			}
		}
	}

	setInitialFourCards(unsortedArrayOfFourCards)
	{
		if (unsortedArrayOfFourCards.length != 4)
			throw "Need exactly 4 initial cards on the game board";
		let sortedAscending = unsortedArrayOfFourCards.sort((a, b) => a-b);
		for (let row = 0; row < NUMBER_OF_ROWS; row++)
		{
			this._board[row][0] = sortedAscending[row];
		}
	}
}