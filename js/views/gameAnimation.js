"use strict";

class GameAnimation
{
	constructor(drawer)
	{
			this._gameCanvasDrawer = drawer;
			this._gameCanvasDrawer._canvas.addEventListener("click", this.onCanvasClicked.bind(this), false);
	}

	moveCard(startRow, startCol, endRow, endCol)
	{
		const start = this._gameCanvasDrawer._cardCoordinates[startRow][startCol];
		const end = this._gameCanvasDrawer._cardCoordinates[endRow][endCol];
		
		this._line = new CardMovementLine(start.x, start.y, end.x, end.y);
		this._nextPt = null;
		if (!this._line.done)
			requestAnimationFrame(this.moveCardHelper.bind(this));
	}
	
	moveCardHelper()
	{
		this._nextPt = this._line.nextPoint();
		this._gameCanvasDrawer.draw();
		this._gameCanvasDrawer.drawFaceDownCard(this._nextPt.x, this._nextPt.y, this._gameCanvasDrawer._cardWidth);
		if (!this._line.done)
			requestAnimationFrame(this.moveCardHelper.bind(this));
	}
	
	flipCard(row, col, number)
	{
		this._fcRow = row;
		this._fcCol = col;
		this._fcNumber = number;
		this._fcX = this._gameCanvasDrawer._cardCoordinates[row][col].x;
		this._fcY = this._gameCanvasDrawer._cardCoordinates[row][col].y;
		this._fcBackW = this._gameCanvasDrawer._cardWidth; // back of the card starts full width
		requestAnimationFrame(this.flipCardHelper.bind(this));
	}
	
	flipCardHelper()
	{
		this._gameCanvasDrawer.clearCardSpace(this._fcX, this._fcY);
		let xToKeepCardCenteredAsItShrinks = undefined;
		if (this._fcBackW > 0)
		{
			xToKeepCardCenteredAsItShrinks = this._fcX + (this._gameCanvasDrawer._cardWidth - this._fcBackW)/2
			this._gameCanvasDrawer.drawFaceDownCard(xToKeepCardCenteredAsItShrinks, this._fcY, this._fcBackW);
		}
		else
		{
			xToKeepCardCenteredAsItShrinks = this._fcX + (this._gameCanvasDrawer._cardWidth + this._fcBackW)/2
			this._gameCanvasDrawer.drawCard(xToKeepCardCenteredAsItShrinks, this._fcY, (-1)*this._fcBackW, this._fcNumber);
		}
		this._fcBackW = this._fcBackW - 3;

		if ((-1)*this._fcBackW < this._gameCanvasDrawer._cardWidth)
			requestAnimationFrame(this.flipCardHelper.bind(this));
	}
		
	onCanvasClicked(event)
	{
		const canvasLeft = this._gameCanvasDrawer.getCanvasOffsetLeft();
		const canvasTop = this._gameCanvasDrawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._gameCanvasDrawer.getCardRowColFromXY(x, y);
		
		if (rowCol)
			this.flipCard(rowCol.row, rowCol.col, Math.floor(Math.random()*20)+44);
	}
}