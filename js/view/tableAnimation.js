"use strict";

class TableAnimation
{
	constructor(drawer)
	{
			this._tableDrawer = drawer;
	}

	moveCard(startRow, startCol, endRow, endCol)
	{
		const start = this._tableDrawer._cardCoordinates[startRow][startCol];
		const end = this._tableDrawer._cardCoordinates[endRow][endCol];
		
		this._line = new CardMovementLine(start.x, start.y, end.x, end.y);
		this._nextPt = null;
		if (!this._line.done)
			requestAnimationFrame(this.moveCardHelper.bind(this));
	}
	
	moveCardHelper()
	{
		this._nextPt = this._line.nextPoint();
		this._tableDrawer.draw();
		this._tableDrawer.drawFaceDownCard(this._nextPt.x, this._nextPt.y, this._tableDrawer._cardWidth);
		if (!this._line.done)
			requestAnimationFrame(this.moveCardHelper.bind(this));
	}
	
	// call this function before updating the model (before removing the card from upcoming card array and putting it in the table array)
	moveIthUpcomingCardToRowCol(i, tableRow, tableCol)
	{
		bAnimationInProgress = true;
		
		let upcomingCardStartRow = this._tableDrawer.upcomingCardsIndexToRow(i);
		let upcomingCardStartCol = this._tableDrawer.upcomingCardsIndexToCol(i);
		
		let startXY = this._tableDrawer._upcomingCardCoordinates[upcomingCardStartRow][upcomingCardStartCol];
		let endXY = this._tableDrawer._cardCoordinates[tableRow][tableCol];
		
		this._movingCardNumber = this._tableDrawer._model.UpcomingCards[i];
		this._movingCardName = this._tableDrawer._model.PlayerNamesOnUpcomingCards[i];
		
		this._line = new CardMovementLine(startXY.x, startXY.y, endXY.x, endXY.y);
		this._nextPt = null;
		if (!this._line.done)
			requestAnimationFrame(this.moveIthUpcomingCardToRowColHelper.bind(this));
	}
	
	moveIthUpcomingCardToRowColHelper()
	{
		this._nextPt = this._line.nextPoint();
		this._tableDrawer.draw();
		this._tableDrawer.drawCard(this._nextPt.x, this._nextPt.y, this._tableDrawer._cardWidth, this._movingCardNumber, this._movingCardName);
		if (!this._line.done)
			requestAnimationFrame(this.moveIthUpcomingCardToRowColHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	// call this function after updating the model with the card in col 5,
	// but before updating the model to say the row was taken
	takeRow(rowIndex)
	{
		bAnimationInProgress = true;
		let startRow = rowIndex;
		let startCol = 5;
		let endRow = rowIndex;
		let endCol = 0;
		const start = this._tableDrawer._cardCoordinates[startRow][startCol];
		const end = this._tableDrawer._cardCoordinates[endRow][endCol];
		
		this._movingCardNumber = this._tableDrawer._model.Table[rowIndex][5];
		this._movingCardName = this._tableDrawer._model.PlayerNamesOnTableCards[rowIndex][5];
		this._line = new CardMovementLine(start.x, start.y, end.x, end.y);
		this._nextPt = null;
		if (!this._line.done)
			requestAnimationFrame(this.takeRowHelper.bind(this));
	}
	
	takeRowHelper()
	{
		if (this._nextPt)
			this._tableDrawer.clearCardSpace(this._nextPt.x, this._nextPt.y);
		this._nextPt = this._line.nextPoint();
		this._tableDrawer.drawCard(this._nextPt.x, this._nextPt.y, this._tableDrawer._cardWidth, this._movingCardNumber, this._movingCardName);
		if (!this._line.done)
			requestAnimationFrame(this.takeRowHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
	
	flipAllUpcomingCards()
	{
		bAnimationInProgress = true;
		this._fcBackW = this._tableDrawer._cardWidth; // back of the card starts full width
		requestAnimationFrame(this.flipAllUpcomingCardsHelper.bind(this));
	}
	
	flipAllUpcomingCardsHelper()
	{
		let x, y, number, playerName;
		let numberOfCardsProcessed = 0;
		for (let row = 0; row < this._tableDrawer._numberOfRows && numberOfCardsProcessed < numberOfPlayers; row++)
		{
			for (let col = 0; col < lc.additionalColsOnTableCanvasForCardsPlayedThisTurn && numberOfCardsProcessed < numberOfPlayers; col++)
			{
				playerName = this._tableDrawer._model.PlayerNamesOnUpcomingCards[numberOfCardsProcessed];
				if (playerName)
				{
					x = this._tableDrawer._upcomingCardCoordinates[row][col].x;
					y = this._tableDrawer._upcomingCardCoordinates[row][col].y;
					number = this._tableDrawer._model.UpcomingCards[numberOfCardsProcessed];

					this._tableDrawer.clearCardSpace(x, y);
					let xToKeepCardCenteredAsItShrinks = undefined;
					if (this._fcBackW > 0)
					{
						xToKeepCardCenteredAsItShrinks = x + (this._tableDrawer._cardWidth - this._fcBackW)/2
						this._tableDrawer.drawFaceDownCard(xToKeepCardCenteredAsItShrinks, y, this._fcBackW, playerName);
					}
					else
					{
						xToKeepCardCenteredAsItShrinks = x + (this._tableDrawer._cardWidth + this._fcBackW)/2
						this._tableDrawer.drawCard(xToKeepCardCenteredAsItShrinks, y, (-1)*this._fcBackW, number, playerName);
					}
				}
				numberOfCardsProcessed++;
			}
		}
		
		this._fcBackW = this._fcBackW - 3;

		if ((-1) * this._fcBackW < this._tableDrawer._cardWidth)
				requestAnimationFrame(this.flipAllUpcomingCardsHelper.bind(this));
		else
			bAnimationInProgress = false;
	}
}