"use strict";

let hi = 44;

// desing parameters
const cardHeightToWidthFactor = 3/4;
const spaceInCanvasesForThisNumberOfRows = 4;
const spaceInCanvasesForThisNumberOfCols = 7;
const margin = 10; // pixels
const radius = 10;
const cowIsThisFractionOfCardHeight = 2/3;
const cowIsThisFractionOfCardWidth = 9/10;
const cowAndNumberAreThisPercentDownTheCard = 0.43;

class CanvasView
{
	constructor(canvas)
	{
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");

		this._cardWidth = undefined;
		this._cardHeight = undefined;
		this._numberOfRows = undefined;
		this._numberOfCols = undefined;

		this._cardCoordinates = [];	// at location [row][col] youll find an object {x: ___,y: ___} with the canvas coordinates of the top left corner of the card

	}
	
	get canvasWidth() { return this._canvas.width;}
	
	// use cardWidth parameter rather than using this._cardWidth because for the fliping of cards,
	// the card has to be redrawn many times at different widths.
	drawCard(x, y, cardWidth, number)
	{
		this.drawBlankCard(x, y, cardWidth, number);
		this.drawBigCow(x, y, cardWidth, number);
		this.drawCardNumber(x, y, cardWidth, number);
		this.drawNegativePts(x, y, cardWidth, number)
	}
	
	drawFaceDownCard(x, y, cardWidth)
	{
		this.drawBlankCard(x, y, cardWidth, undefined);
		this.drawBigCow(x, y, cardWidth, undefined);
	}
	
	drawBlankCard(x, y, cardWidth, number)
	{
		const ctx = this._ctx;
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, cardWidth, this._cardHeight, radius);
		ctx.fillStyle = getCardInfo(number).cardColor;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.closePath();
	}
	
	drawBigCow(x, y, cardWidth, number)
	{
		const ctx = this._ctx;
		
		const cowWidth = cowIsThisFractionOfCardWidth*cardWidth;
		const cowHeight = cowIsThisFractionOfCardHeight*this._cardHeight;
		
		// center of the cow
		const centreX = x + cardWidth/2;
		
		// draw the big cow right in the middle if its a face down card
		const faceUpCard = number != undefined;
		const centreY = faceUpCard ? (y + this._cardHeight * cowAndNumberAreThisPercentDownTheCard) : (y + this._cardHeight/2);
		
		BasicShapeDrawer.drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight);
		ctx.fillStyle = getCardInfo(number).cowColor;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.closePath();
	}
	
	drawCardNumber(x, y, cardWidth, number)
	{
		const ctx = this._ctx;

		const fontPixels = 0.5*this._cardHeight;
		ctx.font = "bold "+fontPixels+"px 'Comic Sans MS'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const maximumFullNumberWidth = 0.9*cardWidth;
		const centreXofNumber= x + (cardWidth/2);
		const centreYofNumber = y+(this._cardHeight * cowAndNumberAreThisPercentDownTheCard);
		ctx.lineWidth = 2;
		ctx.fillStyle = getCardInfo(number).numColor;
		ctx.fillText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
		ctx.strokeText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
	}
	
	drawNegativePts(x, y, cardWidth, number)
	{
		const ctx = this._ctx;
		
		const cardInfo = getCardInfo(number);
		const negativePts = cardInfo.negativePts;
		const centreX = x + cardWidth/2;
		const bottomOfTheCowY = y + cowAndNumberAreThisPercentDownTheCard*this._cardHeight + (cowIsThisFractionOfCardHeight/2)*this._cardHeight;
		const sizeOfGapBetweenCowAndBottomOfCard = this._cardHeight - (bottomOfTheCowY - y);
		const centreY = bottomOfTheCowY + (sizeOfGapBetweenCowAndBottomOfCard/2);
		
		const cowWidth = cardWidth/7;
		const cowHeight = sizeOfGapBetweenCowAndBottomOfCard/2;
		const horizontalSpaceBetweenCows = cowWidth/2;
		const verticalSpaceBetweenCows = cowHeight/3;
		
		if (negativePts === 1)
					this.drawLittleCow(centreX, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		else if (negativePts === 2)
		{
					this.drawLittleCow(centreX - horizontalSpaceBetweenCows, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX + horizontalSpaceBetweenCows, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		}
		else if (negativePts === 3)
		{
					this.drawLittleCow(centreX, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX - cowWidth, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX + cowWidth, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		}
		else if (negativePts === 5)
		{
					this.drawLittleCow(centreX, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX - cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX + cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					
					this.drawLittleCow(centreX - horizontalSpaceBetweenCows, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX + horizontalSpaceBetweenCows, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
		}
		else if (negativePts === 7)
		{
					this.drawLittleCow(centreX - horizontalSpaceBetweenCows, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX + horizontalSpaceBetweenCows, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX - horizontalSpaceBetweenCows - cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX + horizontalSpaceBetweenCows + cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					
					this.drawLittleCow(centreX, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX - cowWidth, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					this.drawLittleCow(centreX + cowWidth, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
		}
	}

	drawLittleCow(centreX, centreY, cowWidth, cowHeight, fillColor)
	{
		const ctx = this._ctx;

		BasicShapeDrawer.drawsimplifiedCowShape(ctx, centreX, centreY, cowWidth, cowHeight)
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.closePath();
	}

}