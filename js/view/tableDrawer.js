"use strict";

class TableDrawer extends Drawer
{
	constructor(canvas, model)
	{
		super(canvas, model);
		this._numberOfRows = NUMBER_OF_ROWS_ON_TABLE_CANVAS;
		this._numberOfCols = NUMBER_OF_COLS_ON_TABLE_CANVAS_NOT_INCLUDING_COLS_FOR_CARDS_PLAYED_THIS_TURN ;
		
		// at location [row][col] youll find an object {x: ___,y: ___} with the canvas coordinates of the top left corner of the card
		this._upcomingCardCoordinates = []; 
		this._dontDrawTheseUpcomingCardsOnDraw = []; // list of cards in animation: i.e. dont draw them on draw()
	}
	
	get UpcomingCardCoordinates() {return this._upcomingCardCoordinates;}
	get DontDrawTheseUpcomingCardsOnDraw() {return this._dontDrawTheseUpcomingCardsOnDraw;}
	set DontDrawTheseUpcomingCardsOnDraw(c) {this._dontDrawTheseUpcomingCardsOnDraw = c};
	
	draw()
	{
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
		this.drawSeparatorLine();
		this.drawWarningRectangles();
		this.drawUpcomingCardRectangles();
		
		this.drawCardsOnTable();
		this.drawUpcomingCards();
	}
	
	drawCardsOnTable()
	{
		let cardNumber = undefined;
		for (let row = 0; row < this._numberOfRows; row++)
		{
			for (let col = 0; col < this._numberOfCols; col++)
			{
				cardNumber = this._model.Table[row][col];
				if (cardNumber)
					this.drawCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, this._cardWidth, cardNumber, this._model.PlayerNamesOnTableCards[row][col]);
			}
		}	
	}
	
	drawUpcomingCards()
	{
		let numberOfCardsDrawn = 0;
		let playerName = undefined;
		let cardNumber = undefined;
		for (let row = 0; row < this._numberOfRows && numberOfCardsDrawn < numberOfPlayers; row++)
		{
			for (let col = 0; col < lc.additionalColsOnTableCanvasForCardsPlayedThisTurn && numberOfCardsDrawn < numberOfPlayers; col++)
			{
				if(!this.DontDrawTheseUpcomingCardsOnDraw.
					includes(this.upcomingCardsRowColToIndex(row, col))) // if the card is currently in animation, dont draw it
				{
					cardNumber = this._model.UpcomingCards[this.upcomingCardsRowColToIndex(row, col)];
					playerName = this._model.PlayerNamesOnUpcomingCards[numberOfCardsDrawn];
					if (playerName && cardNumber)
					{
						if (this._model.UpcomingCardsFaceUp)
							this.drawCard(this._upcomingCardCoordinates[row][col].x, this._upcomingCardCoordinates[row][col].y, this._cardWidth, cardNumber, playerName);
						else
							this.drawFaceDownCard(this._upcomingCardCoordinates[row][col].x, this._upcomingCardCoordinates[row][col].y, this._cardWidth, playerName);
					}
				}
				numberOfCardsDrawn++;
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
			if (this._model.Table[row][redColumn - 1] != undefined)
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
	
	drawSeparatorLine()
	{
		const x = (this._numberOfCols)*this._cardWidth +
					(this._numberOfCols + 1 + lc.extraNumberOfMarginsBetween6thColAndTheRest/2)*lc.margin;
		const startY = lc.margin;
		const endY = this._canvas.height - lc.margin;
		
		const ctx = this._ctx;
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgba(255, 255, 255, 1)";
		ctx.setLineDash([10, 10]);
		
		ctx.beginPath();
		ctx.moveTo(x, startY);
		ctx.lineTo(x, endY);
		
		ctx.stroke();
		ctx.closePath();
		ctx.setLineDash([]);
	}
	
	upcomingCardsIndexToRow(i)
	{
		return Math.floor(i/lc.additionalColsOnTableCanvasForCardsPlayedThisTurn);
	}
	
	upcomingCardsIndexToCol(i)
	{
		return i % lc.additionalColsOnTableCanvasForCardsPlayedThisTurn;
	}
	
	upcomingCardsRowColToIndex(row, col)
	{
		return lc.additionalColsOnTableCanvasForCardsPlayedThisTurn*row + col;
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
		this._cardWidth = (this._canvas.width - ((lc.totalNumberOfColsOnTableCanvas + 2 + lc.extraNumberOfMarginsBetween6thColAndTheRest)*lc.margin)) / lc.totalNumberOfColsOnTableCanvas;
		this._cardHeight = (this._canvas.height - ((NUMBER_OF_ROWS_ON_TABLE_CANVAS + 1)*lc.margin)) / NUMBER_OF_ROWS_ON_TABLE_CANVAS;
	}
	
	calculateUpcomingCardCoordinates()
	{
		let x = (this._numberOfCols)*this._cardWidth +
					(this._numberOfCols + 2 + lc.extraNumberOfMarginsBetween6thColAndTheRest)*lc.margin;
		let y = lc.margin;
		for (let row = 0; row < this._numberOfRows; row++)
		{
			x = (this._numberOfCols)*this._cardWidth +
					(this._numberOfCols + 2 + lc.extraNumberOfMarginsBetween6thColAndTheRest)*lc.margin;
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