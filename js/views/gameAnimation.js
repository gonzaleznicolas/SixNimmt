"use strict";

class GameAnimation
{
    constructor(drawer)
    {
        this._gameCanvasDrawer = drawer;
        this._gameCanvasDrawer._canvas.addEventListener("click", this.canvasClicked.bind(this), false);
    }

	flipCard(row, col, number)
	{
		this._fcRow = row;
		this._fcCol = col;
		this._fcNumber = number;
		this._fcNumberOfIterations = 250;
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

		if ((-1)*this._fcBackW >= this._gameCanvasDrawer._cardWidth)
			return;
		
		requestAnimationFrame(this.flipCardHelper.bind(this));
    }
    
    canvasClicked(event)
    {
        const canvasLeft = this._gameCanvasDrawer.getCanvasOffsetLeft();
        const canvasTop = this._gameCanvasDrawer.getCanvasOffsetTop();

        const x = event.pageX - canvasLeft;
        const y = event.pageY - canvasTop;

        this._gameCanvasDrawer.drawWarningRectangle(x,y);
        
    }
}