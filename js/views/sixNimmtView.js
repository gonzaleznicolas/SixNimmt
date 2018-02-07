"use strict";

let hi = 44;

// desing parameters
const cardHeightToWidthFactor = 3/4;
const spaceInCanvasForThisNumberOfRows = 4;
const spaceInCanvasForThisNumberOfCols = 7;
const margin = 10; // pixels
const cowIsThisFractionOfCardHeight = 2/3;
const cowIsThisFractionOfCardWidth = 9/10;
const cowAndNumberAreThisPercentDownTheCard = 0.4;



class SixNimmtView {
	constructor(sixNimmtModel) {
		this._gallery = $('.gallery')[0];
		this._flickity = this.setUpFlickity();
		this._gameCanvas = $('#gameCanvas')[0];
		this._handCanvas = $('#handCanvas')[0];
		this._gameCtx = this._gameCanvas.getContext("2d");
		this._handCtx = this._handCanvas.getContext("2d");
		
		// make one less column than we left space for. the rightmost column is for the face-down played cards
		this._numberOfRows = spaceInCanvasForThisNumberOfRows;
		this._numberOfCols = spaceInCanvasForThisNumberOfCols - 1;
		
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
	
	drawCards()
	{
		for (let row = 0; row < this._numberOfRows; row++)
		{
			for (let col = 0; col < this._numberOfCols; col++)
			{
				this.drawCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, hi++);
			}
		}
	}
	
	drawCard(x, y, number)
	{
		this.drawBlankCard(this._gameCtx, x, y, this._cardWidth, this._cardHeight, margin, number);
		this.drawBigCow(this._gameCtx, x, y, number);
		this.drawCardNumber(this._gameCtx, x, y, number);
		this.drawNegativePts(this._gameCtx, x, y, number)
	}
	
	drawNegativePts(ctx, x, y, number)
	{
		const cardInfo = this.getCardInfo(number);
		const negativePts = cardInfo.negativePts;
		const centreX = x + this._cardWidth/2;
		const bottomOfTheCowY = y + cowAndNumberAreThisPercentDownTheCard*this._cardHeight + (cowIsThisFractionOfCardHeight/2)*this._cardHeight;
		const sizeOfGapBetweenCowAndBottomOfCard = this._cardHeight - (bottomOfTheCowY - y);
		const centreY = bottomOfTheCowY + (sizeOfGapBetweenCowAndBottomOfCard/2);
		
		const cowWidth = sizeOfGapBetweenCowAndBottomOfCard/2;
		const cowHeight = sizeOfGapBetweenCowAndBottomOfCard/2;
		const horizontalSpaceBetweenCows = cowWidth/2;
		const verticalSpaceBetweenCows = cowHeight/2;
		
		if (negativePts === 1)
					this.drawsimplifiedCow(ctx, centreX, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		else if (negativePts === 2)
		{
					this.drawsimplifiedCow(ctx, centreX - horizontalSpaceBetweenCows, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX + horizontalSpaceBetweenCows, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		}
		else if (negativePts === 3)
		{
					this.drawsimplifiedCow(ctx, centreX, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX - cowWidth, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX + cowWidth, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		}
		else if (negativePts === 5)
		{
					this.drawsimplifiedCow(ctx, centreX, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX - cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX + cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					
					this.drawsimplifiedCow(ctx, centreX - horizontalSpaceBetweenCows, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX + horizontalSpaceBetweenCows, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
		}
		else if (negativePts === 7)
		{
					this.drawsimplifiedCow(ctx, centreX - horizontalSpaceBetweenCows, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX + horizontalSpaceBetweenCows, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX - horizontalSpaceBetweenCows - cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX + horizontalSpaceBetweenCows + cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					
					this.drawsimplifiedCow(ctx, centreX, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX - cowWidth, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawsimplifiedCow(ctx, centreX + cowWidth, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
		}
	}

	drawsimplifiedCow(ctx, centreX, centreY, cowWidth, cowHeight, fillColor)
	{
		const mx = centreX;
		const my = centreY;

		const designConstH = 9;	// dont change
		const designConstW = 10	// dont change
		
		const oneXunit = (1/designConstW)*cowWidth;	// one horizontal unit
		const oneYunit = (1/designConstH)*cowHeight;	// one vertical unit
		
		ctx.beginPath();
		ctx.moveTo(mx, my - 0.5*oneYunit);
		ctx.lineTo(mx - 1*oneXunit, my - 0.5*oneYunit);
		ctx.lineTo(mx - 2.5*oneXunit, my - 2.5*oneYunit);
		ctx.lineTo(mx - 3*oneXunit, my + 0.5*oneYunit);
		ctx.lineTo(mx - 1*oneXunit, my + 0.5*oneYunit);
		ctx.lineTo(mx - 1*oneXunit, my + 2.5*oneYunit);
		ctx.lineTo(mx + 1*oneXunit, my + 2.5*oneYunit);
		ctx.lineTo(mx + 1*oneXunit, my + 0.5*oneYunit);
		ctx.lineTo(mx + 3*oneXunit, my + 0.5*oneYunit);
		ctx.lineTo(mx + 2.5*oneXunit, my - 2.5*oneYunit);
		ctx.lineTo(mx + 1*oneXunit, my - 0.5*oneYunit);
		ctx.lineTo(mx, my - 0.5*oneYunit);
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.closePath();
	}

	drawCow(ctx, centreX, centreY, cowWidth, cowHeight, fillColor)
	{
		const mx = centreX;
		const my = centreY;

		const designConstH = 9;	// dont change
		const designConstW = 10	// dont change
		
		const oneXunit = (1/designConstW)*cowWidth;	// one horizontal unit
		const oneYunit = (1/designConstH)*cowHeight;	// one vertical unit
		
		ctx.beginPath();
		ctx.moveTo(mx + 5*oneXunit, my - 1.8*oneYunit);
		ctx.bezierCurveTo( mx + 4.5*oneXunit, my - 2.6*oneYunit, mx + 4*oneXunit, my - 3.6*oneYunit, mx + 2.7*oneXunit, my - 5*oneYunit);
		ctx.quadraticCurveTo(mx + 3.1*oneXunit, my - 4*oneYunit, mx + 3*oneXunit, my - 2.7*oneYunit);
		ctx.lineTo(mx + 1.5*oneXunit, my - 2.5*oneYunit);
		ctx.lineTo(mx + 2*oneXunit, my - 3*oneYunit);
		ctx.lineTo(mx + 1.5*oneXunit, my - 4.5*oneYunit);
		ctx.lineTo(mx + 0.5*oneXunit, my - 3.5*oneYunit);
		ctx.lineTo(mx + 1*oneXunit, my - 2.5*oneYunit);
		ctx.lineTo(mx + 0, my - 3*oneYunit);
		ctx.lineTo(mx - 1*oneXunit, my - 2.5*oneYunit);
		ctx.lineTo(mx - 0.5*oneXunit, my - 3.5*oneYunit);
		ctx.lineTo(mx - 1.5*oneXunit, my - 4.5*oneYunit);
		ctx.lineTo(mx - 2*oneXunit, my - 3*oneYunit);
		ctx.lineTo(mx - 1.5*oneXunit, my - 2.5*oneYunit);
		ctx.lineTo(mx - 3*oneXunit, my - 2.7*oneYunit);
		ctx.quadraticCurveTo(mx - 3.1*oneXunit, my - 4*oneYunit, mx - 2.7*oneXunit, my - 5*oneYunit);
		ctx.bezierCurveTo(mx - 4*oneXunit, my - 3.6*oneYunit, mx - 4.5*oneXunit, my - 2.6*oneYunit, mx - 5*oneXunit, my - 1.8*oneYunit);
		ctx.quadraticCurveTo(mx - 4.4*oneXunit, my - 1.2*oneYunit,mx - 2.7*oneXunit, my - 0.9*oneYunit);
		ctx.lineTo(mx - 3*oneXunit, my + 0.5*oneYunit);
		ctx.lineTo(mx - 2*oneXunit, my + 1.5*oneYunit);
		ctx.lineTo(mx - 2.8*oneXunit, my + 2.1*oneYunit);
		ctx.lineTo(mx - 2.2*oneXunit, my + 3.5*oneYunit);
		ctx.lineTo(mx - 1.3*oneXunit, my + 3.3*oneYunit);
		ctx.lineTo(mx - 1*oneXunit, my + 4.5*oneYunit);
		ctx.lineTo(mx + 1*oneXunit, my + 4.5*oneYunit);
		ctx.lineTo(mx + 1*oneXunit, my + 4.5*oneYunit);
		ctx.lineTo(mx + 1.3*oneXunit, my + 3.3*oneYunit);
		ctx.lineTo(mx + 2.2*oneXunit, my + 3.5*oneYunit);
		ctx.lineTo(mx + 2.8*oneXunit, my + 2.1*oneYunit);
		ctx.lineTo(mx + 2*oneXunit, my + 1.5*oneYunit);
		ctx.lineTo(mx + 3*oneXunit, my + 0.5*oneYunit);
		ctx.lineTo(mx + 2.7*oneXunit, my - 0.9*oneYunit);
		ctx.quadraticCurveTo(mx + 4.4*oneXunit, my - 1.2*oneYunit,mx + 5*oneXunit, my - 1.8*oneYunit);
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
	
	drawBigCow(ctx, x, y, number)
	{
		const h = cowIsThisFractionOfCardHeight*this._cardHeight;
		const w = cowIsThisFractionOfCardWidth*this._cardWidth;
		
		// center of the cow
		const mx = x + this._cardWidth/2;
		const my = y + this._cardHeight * cowAndNumberAreThisPercentDownTheCard;
		
		this.drawCow(ctx, mx, my, w, h, this.getCardInfo(number).cowColor);
	}
	
	drawCardNumber(ctx, x, y, number)
	{
		const fontPixels = 0.5*this._cardHeight;
		ctx.font = "bold "+fontPixels+"px 'Comic Sans MS'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.lineWidth = 2;
		ctx.fillStyle = this.getCardInfo(number).numColor;
		ctx.fillText(number, x + (this._cardWidth/2), y+(this._cardHeight * cowAndNumberAreThisPercentDownTheCard), 0.9*this._cardWidth);
		ctx.strokeText(number, x + (this._cardWidth/2), y+(this._cardHeight * cowAndNumberAreThisPercentDownTheCard), 0.9*this._cardWidth);
	}
	
	drawBlankCard(ctx, x, y, width, height, radius, number)
	{
		this._gameCtx.fillStyle = this.getCardInfo(number).cardColor;
		this._gameCtx.lineWidth = 1;
		
		ctx.beginPath();
		drawCardShape(ctx, x, y, width, height, radius);
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
		this._cardWidth = (this._gameCanvas.width - ((spaceInCanvasForThisNumberOfCols + 1)*margin)) / spaceInCanvasForThisNumberOfCols;
		this._cardHeight = (this._gameCanvas.height - ((spaceInCanvasForThisNumberOfRows + 1)*margin)) / spaceInCanvasForThisNumberOfRows;
	}
	
	getCardInfo(cardNumber)
	{
		if (cardNumber === 55)
			return {negativePts: 7, cowColor: "red", numColor: "yellow", cardColor: "purple"};
		else if ( cardNumber % 11 === 0)
			return {negativePts: 5, cowColor: "blue", numColor: "#ffbc00", cardColor: "red"};
		else if (cardNumber % 10 === 0)
			return {negativePts: 3, cowColor: "red", numColor: "#85c7e0", cardColor: "#ffbc00"};
		else if (cardNumber % 5 === 0)
			return {negativePts: 2, cowColor: "blue", numColor: "yellow", cardColor: "#85c7e0"};
		else
			return {negativePts: 1, cowColor: "#7f5093", numColor: "white", cardColor: "white"};
	}
	
		/*
	The reason I set canvasHeight = windowHeight*0.9 in case 2 whereas in case 1 i set galleryWidth = windowWidth,
	is that if the width of the canvas is just right, it looks fine, but if the height is exactly right, its hard to
	scroll perfectly to get the whole canvas in the window.
	
	Explanation of the formulas...?
		See the constants cardHeightToWidthFactor, spaceInCanvasForThisNumberOfRows, spaceInCanvasForThisNumberOfCols, margin.
		Those numbers will be set by the the user and the canvas and cards will be layed out acordingly.
		
		The dimensions of the canvas considering the number of cards and the dimensions of the cards can be derived this way:

			cardWidth = cardHeight * cardHeightToWidthFactor
			canvasWidth = (spaceInCanvasForThisNumberOfCols * cardWidth) + (spaceInCanvasForThisNumberOfCols + 1)*margin
			canvasHeight = spaceInCanvasForThisNumberOfRows * cardHeight + (spaceInCanvasForThisNumberOfRows + 1)*margin
			
			For this function, we need to use the formulas above to relate canvasWidth and canvasHeight to eachother in terms of the constants.
			(cancel out the unknowns cardWidth and cardHeight)
			
			The result is:
				canvasHeight = ((spaceInCanvasForThisNumberOfRows*(canvasWidth - ((spaceInCanvasForThisNumberOfCols + 1)*margin)))/(spaceInCanvasForThisNumberOfCols * cardHeightToWidthFactor)) + ((spaceInCanvasForThisNumberOfRows + 1)*margin)
				canvasWidth = ((spaceInCanvasForThisNumberOfCols * cardHeightToWidthFactor * (canvasHeight - ((spaceInCanvasForThisNumberOfRows + 1)*margin)))/spaceInCanvasForThisNumberOfRows) + ((spaceInCanvasForThisNumberOfCols + 1)*margin)
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
		let canvasHeight = ((spaceInCanvasForThisNumberOfRows*(canvasWidth - ((spaceInCanvasForThisNumberOfCols + 1)*margin)))/(spaceInCanvasForThisNumberOfCols * cardHeightToWidthFactor)) + ((spaceInCanvasForThisNumberOfRows + 1)*margin);
		
		// if by setting galleryWidth = windowWidth and maintaining the ration we make the canvas taller than the screen
		if (canvasHeight > windowHeight)
		{
				// CASE 2
				canvasHeight = windowHeight*0.9;
				canvasWidth = ((spaceInCanvasForThisNumberOfCols * cardHeightToWidthFactor * (canvasHeight - ((spaceInCanvasForThisNumberOfRows + 1)*margin)))/spaceInCanvasForThisNumberOfRows) + ((spaceInCanvasForThisNumberOfCols + 1)*margin);
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
