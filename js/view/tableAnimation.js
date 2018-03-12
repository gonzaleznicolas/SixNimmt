"use strict";

class TableAnimation extends Animation
{
	constructor(model)
	{
		super( new TableDrawer($('#tableCanvas')[0], model), model );
	}

	moveCard(startRow, startCol, endRow, endCol)
	{
		const start = this._drawer.CardCoordinates[startRow][startCol];
		const end = this._drawer.CardCoordinates[endRow][endCol];
		
		this._line = new CardMovementLine(start.x, start.y, end.x, end.y);
		this._nextPt = null;
		if (!this._line.done)
			requestAnimationFrame(this.moveCardHelper.bind(this));
	}
	
	moveCardHelper()
	{
		this._nextPt = this._line.nextPoint();
		this._drawer.draw();
		this._drawer.drawFaceDownCard(this._nextPt.x, this._nextPt.y, this._drawer.CardWidth);
		if (!this._line.done)
			requestAnimationFrame(this.moveCardHelper.bind(this));
	}
	
	// call this function before updating the model
	// precondition: fromRow <= toRow
	// note: fromRow toRow is inclusive.
	moveRows(fromRow, toRow, downThisManyRows)
	{
		// if downThisManyRowsIs negative, move up
		bAnimationInProgress = true;
		
		// these rows are in the model before updating the move
		this._fromRow = fromRow;
		this._toRow = toRow;
		
		// we are just gonna use the CardMovementLine for its y values. and we will use the y values as offsets from the
		// original value
		this._line = new CardMovementLine(0, 0, 0, downThisManyRows*(this._drawer.CardHeight + lc.margin));
		this._nextOffset = null;
		if (!this._line.done)
			requestAnimationFrame(this.moveRowsHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	moveRowsHelper()
	{
		this._nextOffset = this._line.nextPoint();
		let cardNumber;
		for (let row = this._fromRow; row <= this._toRow; row++)
		{
			for (let col = 0; col < this._drawer.NumberOfCols; col++)
			{
				if (this._nextOffset)
					this._drawer.clearCardSpace(this._drawer.CardCoordinates[row][col].x, this._drawer.CardCoordinates[row][col].y + this._nextOffset.y);
				
				cardNumber = this._model.Table[row][col];
				if (cardNumber)
					this._drawer.drawCard(this._drawer.CardCoordinates[row][col].x, this._drawer.CardCoordinates[row][col].y + this._nextOffset.y, 
											this._drawer.CardWidth, cardNumber, this._model.PlayerNamesOnTableCards[row][col]);
			}
		}
		if (!this._line.done)
			requestAnimationFrame(this.moveRowsHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	sortUpcomingCards()
	{
		// step 1: make an array newPosition where the index is the old position of a card, and the content is the new position.
		// eg. suppose at position 5 we had the card with number 1. in the newPosition array we are making here, at index 5
		// the content should be 0. i.e. the card that is currently in position 5 (card 1) should after the sort be in position 0.
		// newPosition[5]=0.
		
		bAnimationInProgress = true;
		
		let newPosition = [];
		let sortedUpcomingCards = this._model.UpcomingCards.slice().sort((a, b)=> a-b); // sort a copy of unsorted UpcomingCards
		
		for (let i = 0; i < this._model.UpcomingCards.length; i++)
			newPosition[i] = sortedUpcomingCards.findIndex(element => element==this._model.UpcomingCards[i]);
		
		this._resourcesForCardOriginallyAtPositionI = [];
		
		let startRow, startCol, endRow, endCol, start, end;
		for (let i = 0; i < newPosition.length; i++)
		{
			startRow = this._drawer.upcomingCardsIndexToRow(i);
			startCol = this._drawer.upcomingCardsIndexToCol(i);
			endRow = this._drawer.upcomingCardsIndexToRow(newPosition[i]);
			endCol = this._drawer.upcomingCardsIndexToCol(newPosition[i]);
			start = this._drawer.UpcomingCardCoordinates[startRow][startCol];
			end = this._drawer.UpcomingCardCoordinates[endRow][endCol];
			this._resourcesForCardOriginallyAtPositionI[i] = {
				movingCardNumber : this._model.UpcomingCards[i],
				movingCardName : this._model.PlayerNamesOnUpcomingCards[i],
				line : new CardMovementLine(start.x, start.y, end.x, end.y),
				nextPt : null
			};
			
			if (i != newPosition[i])
				this._drawer.clearCardSpace(start.x, start.y);
		}
		
		if (!this._resourcesForCardOriginallyAtPositionI.every(element => {return element.line.done}))
			requestAnimationFrame(this.sortUpcomingCardsHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	sortUpcomingCardsHelper()
	{
		for (let i = 0; i < this._resourcesForCardOriginallyAtPositionI.length; i++)
		{
			let card = this._resourcesForCardOriginallyAtPositionI[i];
			if(card.nextPt)
				this._drawer.clearExactCardSpace(card.nextPt.x, card.nextPt.y);
			card.nextPt = card.line.nextPoint();
			this._drawer.drawCard(card.nextPt.x, card.nextPt.y, this._drawer.CardWidth, card.movingCardNumber, card.movingCardName);
		}
		
		if (!this._resourcesForCardOriginallyAtPositionI.every(element => {return element.line.done}))
			requestAnimationFrame(this.sortUpcomingCardsHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	// call this function before updating the model (before removing the card from upcoming card array and putting it in the table array)
	moveIthUpcomingCardToRowCol(i, tableRow, tableCol)
	{
		bAnimationInProgress = true;
		
		let upcomingCardStartRow = this._drawer.upcomingCardsIndexToRow(i);
		let upcomingCardStartCol = this._drawer.upcomingCardsIndexToCol(i);
		
		let startXY = this._drawer.UpcomingCardCoordinates[upcomingCardStartRow][upcomingCardStartCol];
		let endXY = this._drawer.CardCoordinates[tableRow][tableCol];
		
		this._movingCardNumber = this._model.UpcomingCards[i];
		this._movingCardName = this._model.PlayerNamesOnUpcomingCards[i];
		
		this._line = new CardMovementLine(startXY.x, startXY.y, endXY.x, endXY.y);
		this._nextPt = null;
		if (!this._line.done)
			requestAnimationFrame(this.moveIthUpcomingCardToRowColHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	moveIthUpcomingCardToRowColHelper()
	{
		this._nextPt = this._line.nextPoint();
		this._drawer.draw();
		this._drawer.drawCard(this._nextPt.x, this._nextPt.y, this._drawer.CardWidth, this._movingCardNumber, this._movingCardName);
		if (!this._line.done)
			requestAnimationFrame(this.moveIthUpcomingCardToRowColHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	

	takeRow(rowIndex)
	{
		bAnimationInProgress = true;
		
		// first, find the col of the last card in the row
		let indexOfFirstUndefinedInTheRow = this._model.Table[rowIndex].findIndex(cardNum => {return cardNum == undefined});
		let indexOfLastCardInTheRow = indexOfFirstUndefinedInTheRow == -1 ? this._drawer._numberOfCols - 1 : indexOfFirstUndefinedInTheRow - 1;

		let startRow = rowIndex;
		let startCol = indexOfLastCardInTheRow;
		let endRow = rowIndex;
		let endCol = 0;
		const start = this._drawer.CardCoordinates[startRow][startCol];
		const end = this._drawer.CardCoordinates[endRow][endCol];
		
		this._movingCardNumber = this._model.Table[rowIndex][indexOfLastCardInTheRow];
		this._movingCardName = this._model.PlayerNamesOnTableCards[rowIndex][indexOfLastCardInTheRow];
		this._drawer.clearCardSpace(start.x, start.y);
		this._line = new CardMovementLine(start.x, start.y, end.x, end.y);
		this._nextPt = null;
		if (!this._line.done)
			requestAnimationFrame(this.takeRowHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	takeRowHelper()
	{
		if (this._nextPt)
			this._drawer.clearCardSpace(this._nextPt.x, this._nextPt.y);
		this._nextPt = this._line.nextPoint();
		this._drawer.drawCard(this._nextPt.x, this._nextPt.y, this._drawer.CardWidth, this._movingCardNumber, this._movingCardName);
		if (!this._line.done)
			requestAnimationFrame(this.takeRowHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	flipAllUpcomingCards()
	{
		bAnimationInProgress = true;
		this._fcBackW = this._drawer.CardWidth; // back of the card starts full width
		requestAnimationFrame(this.flipAllUpcomingCardsHelper.bind(this));
	}
	
	flipAllUpcomingCardsHelper()
	{
		let x, y, number, playerName;
		let numberOfCardsProcessed = 0;
		for (let row = 0; row < this._drawer.NumberOfRows && numberOfCardsProcessed < numberOfPlayers; row++)
		{
			for (let col = 0; col < lc.additionalColsOnTableCanvasForCardsPlayedThisTurn && numberOfCardsProcessed < numberOfPlayers; col++)
			{
				playerName = this._model.PlayerNamesOnUpcomingCards[numberOfCardsProcessed];
				if (playerName)
				{
					x = this._drawer.UpcomingCardCoordinates[row][col].x;
					y = this._drawer.UpcomingCardCoordinates[row][col].y;
					number = this._model.UpcomingCards[numberOfCardsProcessed];

					this._drawer.clearCardSpace(x, y);
					let xToKeepCardCenteredAsItShrinks = undefined;
					if (this._fcBackW > 0)
					{
						xToKeepCardCenteredAsItShrinks = x + (this._drawer.CardWidth - this._fcBackW)/2
						this._drawer.drawFaceDownCard(xToKeepCardCenteredAsItShrinks, y, this._fcBackW, playerName);
					}
					else
					{
						xToKeepCardCenteredAsItShrinks = x + (this._drawer.CardWidth + this._fcBackW)/2
						this._drawer.drawCard(xToKeepCardCenteredAsItShrinks, y, (-1)*this._fcBackW, number, playerName);
					}
				}
				numberOfCardsProcessed++;
			}
		}
		
		this._fcBackW = this._fcBackW - 3;

		if ((-1) * this._fcBackW < this._drawer.CardWidth)
				requestAnimationFrame(this.flipAllUpcomingCardsHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
}