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
		this._fcRow = row;
		this._fcCol = col;
		this._fcNumber = number;
		this._fcX = this._tableDrawer._cardCoordinates[row][col].x;
		this._fcY = this._tableDrawer._cardCoordinates[row][col].y;
		this._fcBackW = this._tableDrawer._cardWidth; // back of the card starts full width
		requestAnimationFrame(this.flipCardHelper.bind(this));
	}
	
	flipCardHelper()
	{
		this._tableDrawer.clearCardSpace(this._fcX, this._fcY);
		let xToKeepCardCenteredAsItShrinks = undefined;
		if (this._fcBackW > 0)
		{
			xToKeepCardCenteredAsItShrinks = this._fcX + (this._tableDrawer._cardWidth - this._fcBackW)/2
			this._tableDrawer.drawFaceDownCard(xToKeepCardCenteredAsItShrinks, this._fcY, this._fcBackW);
		}
		else
		{
			xToKeepCardCenteredAsItShrinks = this._fcX + (this._tableDrawer._cardWidth + this._fcBackW)/2
			this._tableDrawer.drawCard(xToKeepCardCenteredAsItShrinks, this._fcY, (-1)*this._fcBackW, this._fcNumber);
		}
		this._fcBackW = this._fcBackW - 3;

		if ((-1)*this._fcBackW < this._tableDrawer._cardWidth)
			requestAnimationFrame(this.flipCardHelper.bind(this));
	}
		
	onCanvasClicked(event)
	{
		this.flipAllUpcomingCards();
	}
}