"use strict";

class HandCanvasDrawer extends CanvasDrawer
{
	constructor(canvas)
	{
		super(canvas);
		this._numberOfRows = numberOfRowsInHandCanvas;
		this._numberOfCols = numberOfColsInHandCanvas;
	}
	
	draw()
	{	
		for (let row = 0; row < this._numberOfRows; row++)
		{
			for (let col = 0; col < this._numberOfCols; col++)
			{
				this.drawCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, this._cardWidth, row*col+col+30);
			}
		}
	}
	
	dimAll()
	{	
		for (let row = 0; row < this._numberOfRows; row++)
		{
			for (let col = 0; col < this._numberOfCols; col++)
			{
				this.dimCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y);
			}
		}
	}
	
	resize(gameCanvasCardHeight)
	{
		// Idea: based on the gameCanvasCardHeight, make the cards on the hand canvas
		// (spaceInGameCanvasForThisNumberOfCols/numberOfColsInHandCanvas)ths as big as the cards on the game canvas.
		// Once we know the hand canvas card dimensions, using the global margin we can calculate
		// the hand canvas dimensions based on how much space is necessary for two rows of 5 cards.
		this.calculateCardDimensions(gameCanvasCardHeight);
		this.setCanvasSize();
		this.calculateCardCoordinates();
	}
	
	calculateCardDimensions(gameCanvasCardHeight)
	{
		const gameCanvasCardWidth = cardHeightToWidthFactor * gameCanvasCardHeight;
		const gameCanvasToHandCanvasCardSizeFactor = (spaceInGameCanvasForThisNumberOfCols/numberOfColsInHandCanvas);
		this._cardWidth = gameCanvasToHandCanvasCardSizeFactor * gameCanvasCardWidth;
		this._cardHeight = gameCanvasToHandCanvasCardSizeFactor * gameCanvasCardHeight;
	}
	
	setCanvasSize()
	{	
		this._canvas.width = numberOfColsInHandCanvas*this._cardWidth + (numberOfColsInHandCanvas+1)*margin;
		this._canvas.height = numberOfRowsInHandCanvas*this._cardHeight + (numberOfRowsInHandCanvas+1)*margin;
	}
}