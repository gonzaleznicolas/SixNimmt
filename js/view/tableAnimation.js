"use strict";

class TableAnimation
{
	constructor(drawer)
	{
			this._tableDrawer = drawer;
			this._tableDrawer._canvas.addEventListener("click", this.onCanvasClicked.bind(this), false);
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
	
	flipAllUpcomingCards()
	{
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
				playerName = this._tableDrawer._model.upcomingCardNames[numberOfCardsProcessed];
				if (playerName)
				{
					x = this._tableDrawer._upcomingCardCoordinates[row][col].x;
					y = this._tableDrawer._upcomingCardCoordinates[row][col].y;
					number = this._tableDrawer._model.upcomingCards[numberOfCardsProcessed];

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

		if ((-1)*this._fcBackW < this._tableDrawer._cardWidth)
			requestAnimationFrame(this.flipAllUpcomingCardsHelper.bind(this));
	}
		
	onCanvasClicked(event)
	{
		this.flipAllUpcomingCards();
	}
}