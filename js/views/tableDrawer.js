"use strict";

class TableDrawer extends Drawer
{
	constructor(canvas)
	{
		super(canvas);
		
		this._numberOfRows = lc.numberOfRowsOnTableCanvas;
		this._numberOfCols = lc.numberOfColsOnTableCanvasNotIncludingColsForCardsPlayedThisTurn ;
		
		// at location [row][col] youll find an object {x: ___,y: ___} with the canvas coordinates of the top left corner of the card
		this._upcomingCardCoordinates = []; 
	}
	
	draw()
	{
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
		this.drawWarningRectangles();
		this.drawUpcomingCardRectangles();
		
		for (let row = 0; row < this._numberOfRows; row++)
		{
			for (let col = 0; col < this._numberOfCols - 1; col++)
			{
				this.drawFaceDownCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, this._cardWidth);
			}
		}
	}
	
	drawUpcomingCardRectangles()
	{
		let numberOfRectanglesDrawn = 0;
		for (let row = 0; row < this._numberOfRows && numberOfRectanglesDrawn < numberOfPlayers; row++)
		{
			for (let col = 0; col < lc.additionalColsOnTableCanvasForCardsPlayedThisTurn && numberOfRectanglesDrawn < numberOfPlayers; col++)
			{
				
				this.drawUpcomingCardRectangle(this._upcomingCardCoordinates[row][col].x, this._upcomingCardCoordinates[row][col].y);
				numberOfRectanglesDrawn++;
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
	
	drawUpcomingCardRectangle(x, y)
	{
		const ctx = this._ctx;
		const width = this._cardWidth;
		const height = this._cardHeight;
		
		// draw card outline
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgba(255, 255, 255, 1)";
		ctx.setLineDash([3, 3]);
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, width, height, lc.radius);
		ctx.stroke();
		ctx.closePath();
		ctx.setLineDash([]);
	}
	
	drawWarningRectangle(x, y)
	{
		const ctx = this._ctx;
		const width = this._cardWidth;
		const height = this._cardHeight;
		
		// draw card outline
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgba(111, 10, 10, 1)";
		ctx.setLineDash([3, 3]);
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, width, height, lc.radius);
		ctx.stroke();
		ctx.closePath();
		ctx.setLineDash([]);

		// draw angry cow
		ctx.fillStyle = "rgba(111, 10, 10, 1)";
		const cowWidth = lc.cowIsThisFractionOfCardWidth*this._cardWidth;
		const cowHeight = lc.cowIsThisFractionOfCardHeight*this._cardHeight;
		const centreX = x + this._cardWidth/2;
		const centreY = y + this._cardHeight/2;
		BasicShapeDrawer.drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight)
		ctx.fill();
		ctx.closePath();
	}
	
	resize()
	{
		this.setCanvasSize(lc.galleryWidth - 2*lc.deFactoSpaceForOneFlickityArrow, lc.galleryHeight);
		this.calculateCardDimensions();
		this.calculateCardCoordinates();
		this.calculateUpcomingCardCoordinates();
	}

	calculateCardDimensions()
	{
		this._cardWidth = (this._canvas.width - ((lc.totalNumberOfColsOnTableCanvas + 1 + lc.extraNumberOfMarginsBetween6thColAndTheRest)*lc.margin)) / lc.totalNumberOfColsOnTableCanvas;
		this._cardHeight = (this._canvas.height - ((lc.numberOfRowsOnTableCanvas + 1)*lc.margin)) / lc.numberOfRowsOnTableCanvas;
	}
	
	calculateUpcomingCardCoordinates()
	{
		let x = (this._numberOfCols)*this._cardWidth +
					(this._numberOfCols + 1 + lc.extraNumberOfMarginsBetween6thColAndTheRest)*lc.margin;
		let y = lc.margin;
		for (let row = 0; row < this._numberOfRows; row++)
		{
			x = (this._numberOfCols)*this._cardWidth +
					(this._numberOfCols + 1 + lc.extraNumberOfMarginsBetween6thColAndTheRest)*lc.margin;
			this._upcomingCardCoordinates[row] = [];
			for (let col = 0; col < lc.additionalColsOnTableCanvasForCardsPlayedThisTurn; col++)
			{
				this._upcomingCardCoordinates[row][col] = {x: x, y: y};
				x = x + this._cardWidth + lc.margin;
			}
			y = y + this._cardHeight + lc.margin;
		}
	}
	
	setCanvasSize(width, height)
	{
		this._canvas.width = width;
		this._canvas.height = height;
	}
}