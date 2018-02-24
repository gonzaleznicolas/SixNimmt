"use strict";

class TableDrawer extends Drawer
{
	constructor(canvas)
	{
		super(canvas);
		
		this._numberOfRows = numberOfRowsOnTableCanvas;
		this._numberOfCols = numberOfColsOnTableCanvasNotIncludingColsForCardsPlayedThisTurn;
		this._totalExtraSpaceToTheRightForUpcomingCards = undefined;
		
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
			for (let col = 0; col < additionalColsOnTableCanvasForCardsPlayedThisTurn && numberOfRectanglesDrawn < numberOfPlayers; col++)
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
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, width, height, radius);
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
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, width, height, radius);
		ctx.stroke();
		ctx.closePath();
		ctx.setLineDash([]);

		// draw angry cow
		ctx.fillStyle = "rgba(111, 10, 10, 1)";
		const cowWidth = cowIsThisFractionOfCardWidth*this._cardWidth;
		const cowHeight = cowIsThisFractionOfCardHeight*this._cardHeight;
		const centreX = x + this._cardWidth/2;
		const centreY = y + this._cardHeight/2;
		BasicShapeDrawer.drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight)
		ctx.fill();
		ctx.closePath();
	}
	
	resize(galleryWidth, galleryHeight)
	{
		this.setCanvasSize(galleryWidth - 2*deFactoSpaceForOneFlickityArrow, galleryHeight);
		this.calculateCardDimensions();
		this.calculateCardCoordinates();
		this.calculateUpcomingCardCoordinates();
	}

	calculateCardDimensions()
	{
		this._cardWidth = (this._canvas.width - ((totalNumberOfColsOnTableCanvas + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin)) / totalNumberOfColsOnTableCanvas;
		this._cardHeight = (this._canvas.height - ((numberOfRowsOnTableCanvas + 1)*margin)) / numberOfRowsOnTableCanvas;
		
		this._totalExtraSpaceToTheRightForUpcomingCards = this._cardWidth*additionalColsOnTableCanvasForCardsPlayedThisTurn + extraNumberOfMarginsBetween6thColAndTheRest*margin;
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
	
	calculateUpcomingCardCoordinates()
	{
		let x = (this._numberOfCols)*this._cardWidth +
					(this._numberOfCols + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin;
		let y = margin;
		for (let row = 0; row < this._numberOfRows; row++)
		{
			x = (this._numberOfCols)*this._cardWidth +
					(this._numberOfCols + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin;
			this._upcomingCardCoordinates[row] = [];
			for (let col = 0; col < additionalColsOnTableCanvasForCardsPlayedThisTurn; col++)
			{
				this._upcomingCardCoordinates[row][col] = {x: x, y: y};
				x = x + this._cardWidth + margin;
			}
			y = y + this._cardHeight + margin;
		}
	}
	
	setCanvasSize(width, height)
	{
		this._canvas.width = width;
		this._canvas.height = height;
	}
}