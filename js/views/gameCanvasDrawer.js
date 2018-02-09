"use strict";

class GameCanvasDrawer extends CanvasDrawer
{
	constructor(canvas)
	{
		super(canvas);
		
		// make one less column than we left space for. the rightmost column is for the face-down played cards
		this._numberOfRows = spaceInCanvasesForThisNumberOfRows;
		this._numberOfCols = spaceInCanvasesForThisNumberOfCols - 1;
	}
	
	draw()
	{
		this.drawWarningRectangles();
		
		for (let row = 0; row < this._numberOfRows; row++)
		{
			for (let col = 0; col < this._numberOfCols - 1; col++)
			{
				this.drawCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, this._cardWidth, hi++);
			}
		}
	}
	
	drawWarningRectangles()
	{
		const redColumn = 5; // if you place the 6th card (5th index) you take the whole row
		for (let row = 0; row < this._numberOfRows; row++)
		{
			this.drawWarningRectangle(this._cardCoordinates[row][redColumn].x, this._cardCoordinates[row][redColumn].y);
		}
	}
	
	drawWarningRectangle(x, y)
	{
		const ctx = this._ctx;
		const width = this._cardWidth;
		const height = this._cardHeight;
		
		// draw card outline
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#6f0a0a";
		ctx.setLineDash([3, 3]);
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, width, height, radius);
		ctx.stroke();
		ctx.closePath();
		ctx.setLineDash([]);

		// draw angry cow
		ctx.fillStyle = "#6f0a0a";
		const cowWidth = cowIsThisFractionOfCardWidth*this._cardWidth;
		const cowHeight = cowIsThisFractionOfCardHeight*this._cardHeight;
		const centreX = x + this._cardWidth/2;
		const centreY = y + this._cardHeight/2;
		BasicShapeDrawer.drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight)
		ctx.fill();
		ctx.closePath();
	}
	
	resize()
	{
		this.setCanvasSize();
		this.calculateCardDimensions();
		this.calculateCardCoordinates();
	}

	calculateCardDimensions()
	{
		this._cardWidth = (this._canvas.width - ((spaceInCanvasesForThisNumberOfCols + 1)*margin)) / spaceInCanvasesForThisNumberOfCols;
		this._cardHeight = (this._canvas.height - ((spaceInCanvasesForThisNumberOfRows + 1)*margin)) / spaceInCanvasesForThisNumberOfRows;
	}
	
	calculateCardCoordinates()
	{
		let x = margin;
		let y = margin;
		for (let row = 0; row < this._numberOfRows; row++)
		{
			x = margin;
			this._cardCoordinates[row] = [];
			for (let col = 0; col < this._numberOfCols; col++)
			{
				this._cardCoordinates[row][col] = {x: x, y: y};
				x = x + this._cardWidth + margin;
			}
			y = y + this._cardHeight + margin;
		}
	}

	/*
	The reason I set canvasHeight = windowHeight*0.9 in case 2 whereas in case 1 i set galleryWidth = windowWidth,
	is that if the width of the canvas is just right, it looks fine, but if the height is exactly right, its hard to
	scroll perfectly to get the whole canvas in the window.
	
	Explanation of the formulas...?
		See the constants cardHeightToWidthFactor, spaceInCanvasesForThisNumberOfRows, spaceInCanvasesForThisNumberOfCols, margin.
		Those numbers will be set by the the user and the canvas and cards will be layed out acordingly.
		
		The dimensions of the canvas considering the number of cards and the dimensions of the cards can be derived this way:

			cardWidth = cardHeight * cardHeightToWidthFactor
			canvasWidth = (spaceInCanvasesForThisNumberOfCols * cardWidth) + (spaceInCanvasesForThisNumberOfCols + 1)*margin
			canvasHeight = spaceInCanvasesForThisNumberOfRows * cardHeight + (spaceInCanvasesForThisNumberOfRows + 1)*margin
			
			For this function, we need to use the formulas above to relate canvasWidth and canvasHeight to eachother in terms of the constants.
			(cancel out the unknowns cardWidth and cardHeight)
			
			The result is:
				canvasHeight = ((spaceInCanvasesForThisNumberOfRows*(canvasWidth - ((spaceInCanvasesForThisNumberOfCols + 1)*margin)))/(spaceInCanvasesForThisNumberOfCols * cardHeightToWidthFactor)) + ((spaceInCanvasesForThisNumberOfRows + 1)*margin)
				canvasWidth = ((spaceInCanvasesForThisNumberOfCols * cardHeightToWidthFactor * (canvasHeight - ((spaceInCanvasesForThisNumberOfRows + 1)*margin)))/spaceInCanvasesForThisNumberOfRows) + ((spaceInCanvasesForThisNumberOfCols + 1)*margin)
	*/
	setCanvasSize()
	{
		// Known variables
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();
		const spaceForOneFlickityArrow = 65;
		
		// CASE 1
		let canvasWidth = windowWidth - 2*spaceForOneFlickityArrow;
		let canvasHeight = ((spaceInCanvasesForThisNumberOfRows*(canvasWidth - ((spaceInCanvasesForThisNumberOfCols + 1)*margin)))/(spaceInCanvasesForThisNumberOfCols * cardHeightToWidthFactor)) + ((spaceInCanvasesForThisNumberOfRows + 1)*margin);
		
		// if by setting canvasWidth = windowWidth - 2*spaceForOneFlickityArrow and maintaining the ration we make the canvas taller than the screen
		if (canvasHeight > windowHeight)
		{
				// CASE 2
				canvasHeight = windowHeight*0.9;
				canvasWidth = ((spaceInCanvasesForThisNumberOfCols * cardHeightToWidthFactor * (canvasHeight - ((spaceInCanvasesForThisNumberOfRows + 1)*margin)))/spaceInCanvasesForThisNumberOfRows) + ((spaceInCanvasesForThisNumberOfCols + 1)*margin);
		}

		this._canvas.width = canvasWidth;
		this._canvas.height = canvasHeight;
	}
}