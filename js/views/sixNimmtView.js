"use strict";

// constants for determining game board size
const cardHeightToWidthFactor = 3/4;
const numberOfRows = 4;
const numberOfCols = 7;
const margin = 10; // pixels

class SixNimmtView {
	constructor(sixNimmtModel) {
		this._gallery = $('.gallery')[0];
		this._flickity = this.setUpFlickity();
		this._gameCanvas = $('#gameCanvas')[0];
		this._handCanvas = $('#handCanvas')[0];
		this._gameCtx = this._gameCanvas.getContext("2d");
		this._handCtx = this._handCanvas.getContext("2d");
		
		this._cardWidth = 20;
		this._cardHeight = 30;
		
		this._resizeTimeout;
		this._cardCoordinates = [];	// at location [row][col] youll find an object {x: ___,y: ___} with the canvas coordinates of the top left corner of the card
		this.drawCanvases();
		
		$(window).on("resize", this.onResizeWindow.bind(this));	// i have to bind(this) because otherwise when onResizeWindow is called,
															// 'this' will be window, not this object, and it wont find setCanvasSize.
															// event handlers are by default called with 'this' set to the window object
		$(window).on("orientationchange", this.onResizeWindow.bind(this));
	}
	
	calculateCardCoordinates()
	{
		let x = margin;
		let y = margin;
		for (let row = 0; row < numberOfRows; row++)
		{
			x = margin;
			this._cardCoordinates[row] = [];
			for (let col = 0; col < numberOfCols; col++)
			{
				this._cardCoordinates[row][col] = {x: x, y: y};
				x = x + this._cardWidth + margin;
			}
			y = y + this._cardHeight + margin;
		}
	}
	
	drawCards()
	{
		for (let row = 0; row < numberOfRows; row++)
		{
			for (let col = 0; col < numberOfCols; col++)
			{
				this.drawCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, 56);
			}
		}
	}
	
	drawCard(x, y, number)// number
	{
		this.drawCardShape(this._gameCtx, x, y, this._cardWidth, this._cardHeight, margin);
		this.drawCardNumber(this._gameCtx, x, y, number);
	}
	
	drawCardNumber(ctx, x, y, number)
	{
		const fontPixels = 0.5*this._cardHeight;
		ctx.font = fontPixels+"px 'Consolas'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.lineWidth = 2;
		ctx.fillStyle = '#7f5093';
		ctx.fillText(number, x + (this._cardWidth/2), y+(this._cardHeight*0.4), 0.9*this._cardWidth);
		ctx.strokeText(number, x + (this._cardWidth/2), y+(this._cardHeight*0.4), 0.9*this._cardWidth);
	}
	
	drawCardShape(ctx, x, y, width, height, radius)
	{
		this._gameCtx.fillStyle = "white";
		this._gameCtx.lineWidth = 1;
		
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.arcTo(x, y + height, x + radius, y + height, radius);
		ctx.lineTo(x + width - radius, y + height);
		ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
		ctx.lineTo(x + width, y + radius);
		ctx.arcTo(x + width, y, x + width - radius, y, radius);
		ctx.lineTo(x + radius, y);
		ctx.arcTo(x, y, x, y + radius, radius);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
	
	setUpFlickity()
	{
		const flickity = new Flickity( this._gallery, { cellAlign: 'center', contain: true, wrapAround: true} );
		return flickity;
	}
	
	drawCanvases()
	{
		$(this._gallery).css("visibility", "hidden"); 
		this.setCanvasSize();
		this.calculateCardDimensions();
		this.calculateCardCoordinates();
		this.drawCards();
		$(this._gallery).css("visibility", "visible"); 
	}
	
	onResizeWindow()
	{
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.drawCanvases.bind(this), 500);
	}
	
	calculateCardDimensions()
	{
		this._cardWidth = (this._gameCanvas.width - ((numberOfCols + 1)*margin)) / numberOfCols;
		this._cardHeight = (this._gameCanvas.height - ((numberOfRows + 1)*margin)) / numberOfRows;
	}
	
		/*
	The reason I set canvasHeight = windowHeight*0.9 in case 2 whereas in case 1 i set galleryWidth = windowWidth,
	is that if the width of the canvas is just right, it looks fine, but if the height is exactly right, its hard to
	scroll perfectly to get the whole canvas in the window.
	
	Explanation of the formulas...?
		See the constants cardHeightToWidthFactor, numberOfRows, numberOfCols, margin.
		Those numbers will be set by the the user and the canvas and cards will be layed out acordingly.
		
		The dimensions of the canvas considering the number of cards and the dimensions of the cards can be derived this way:

			cardWidth = cardHeight * cardHeightToWidthFactor
			canvasWidth = (numberOfCols * cardWidth) + (numberOfCols + 1)*margin
			canvasHeight = numberOfRows * cardHeight + (numberOfRows + 1)*margin
			
			For this function, we need to use the formulas above to relate canvasWidth and canvasHeight to eachother in terms of the constants.
			(cancel out the unknowns cardWidth and cardHeight)
			
			The result is:
				canvasHeight = ((numberOfRows*(canvasWidth - ((numberOfCols + 1)*margin)))/(numberOfCols * cardHeightToWidthFactor)) + ((numberOfRows + 1)*margin)
				canvasWidth = ((numberOfCols * cardHeightToWidthFactor * (canvasHeight - ((numberOfRows + 1)*margin)))/numberOfRows) + ((numberOfCols + 1)*margin)
	*/
	setCanvasSize()
	{
		// Known variables
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();
		const spaceForOneFlickityArrow = 65;
		
		// CASE 1
		let galleryWidth = windowWidth;
		let canvasWidth = windowWidth - 2*spaceForOneFlickityArrow;
		let canvasHeight = ((numberOfRows*(canvasWidth - ((numberOfCols + 1)*margin)))/(numberOfCols * cardHeightToWidthFactor)) + ((numberOfRows + 1)*margin);
		
		// if by setting galleryWidth = windowWidth and maintaining the ration we make the canvas taller than the screen
		if (canvasHeight > windowHeight)
		{
				// CASE 2
				canvasHeight = windowHeight*0.9;
				canvasWidth = ((numberOfCols * cardHeightToWidthFactor * (canvasHeight - ((numberOfRows + 1)*margin)))/numberOfRows) + ((numberOfCols + 1)*margin);
				galleryWidth = canvasWidth + 2*spaceForOneFlickityArrow;
		}
		
		$(this._gallery).css("width", galleryWidth+"px");
		this._gameCanvas.width = canvasWidth;
		this._gameCanvas.height = canvasHeight;
		this._handCanvas.width = canvasWidth;
		this._handCanvas.height = canvasHeight;

		this._flickity.resize();	// the gallery sets its height to fit the tallest galleryCell. But you need to call resize for it to redraw.
		console.log("Canvas resized...");

	}
}
