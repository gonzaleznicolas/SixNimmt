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
	
	drawCard(x, y, number)
	{
		this.drawBlankCard(x, y, number);
		this.drawBigCow(x, y, number);
		this.drawCardNumber(x, y, number);
		this.drawNegativePts(x, y, number)
	}
	
	drawNegativePts(x, y, number)
	{
		const ctx = this._ctx;
		
		const cardInfo = getCardInfo(number);
		const negativePts = cardInfo.negativePts;
		const centreX = x + this._cardWidth/2;
		const bottomOfTheCowY = y + cowAndNumberAreThisPercentDownTheCard*this._cardHeight + (cowIsThisFractionOfCardHeight/2)*this._cardHeight;
		const sizeOfGapBetweenCowAndBottomOfCard = this._cardHeight - (bottomOfTheCowY - y);
		const centreY = bottomOfTheCowY + (sizeOfGapBetweenCowAndBottomOfCard/2);
		
		const cowWidth = sizeOfGapBetweenCowAndBottomOfCard/2;
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

	drawBlankCard(x, y, number)
	{
		const ctx = this._ctx;
		const width = this._cardWidth;
		const height = this._cardHeight;
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, width, height, radius);
		ctx.fillStyle = getCardInfo(number).cardColor;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.closePath();
	}
	
	drawCardNumber(x, y, number)
	{
		const ctx = this._ctx;

		const fontPixels = 0.5*this._cardHeight;
		ctx.font = "bold "+fontPixels+"px 'Comic Sans MS'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const maximumFullNumberWidth = 0.9*this._cardWidth;
		const centreXofNumber= x + (this._cardWidth/2);
		const centreYofNumber = y+(this._cardHeight * cowAndNumberAreThisPercentDownTheCard);
		ctx.lineWidth = 2;
		ctx.fillStyle = getCardInfo(number).numColor;
		ctx.fillText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
		ctx.strokeText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
	}

	drawLittleCow(centreX, centreY, cowWidth, cowHeight, fillColor)
	{
		const ctx = this._ctx;

		BasicShapeDrawer.drawsimplifiedCowShape(ctx, centreX, centreY, cowWidth, cowHeight)
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.closePath();
	}

	drawBigCow(x, y, number)
	{
		const ctx = this._ctx;
		
		const cowWidth = cowIsThisFractionOfCardWidth*this._cardWidth;
		const cowHeight = cowIsThisFractionOfCardHeight*this._cardHeight;
		
		// center of the cow
		const centreX = x + this._cardWidth/2;
		const centreY = y + this._cardHeight * cowAndNumberAreThisPercentDownTheCard;
		
		BasicShapeDrawer.drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight);
		ctx.fillStyle = getCardInfo(number).cowColor;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.closePath();
	}

}