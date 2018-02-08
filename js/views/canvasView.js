"use strict";

let hi = 44;

// desing parameters
const cardHeightToWidthFactor = 3/4;
const spaceInCanvasesForThisNumberOfRows = 4;
const spaceInCanvasesForThisNumberOfCols = 7;
const margin = 10; // pixels
const cowIsThisFractionOfCardHeight = 2/3;
const cowIsThisFractionOfCardWidth = 9/10;
const cowAndNumberAreThisPercentDownTheCard = 0.43;

class CanvasView
{
	constructor(canvas)
	{
		this._canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this._cardWidth = undefined;
		this._cardHeight = undefined;
		this._numberOfRows = undefined;
		this._numberOfCols = undefined;

		this._cardCoordinates = [];	// at location [row][col] youll find an object {x: ___,y: ___} with the canvas coordinates of the top left corner of the card

	}
	
	// drawCard(x, y, number)
	// {
		// this.drawBlankCard(this._gameCtx, x, y, this._cardWidth, this._cardHeight, margin, number);
		// this.drawBigCow(this._gameCtx, x, y, number);
		// this.drawCardNumber(this._gameCtx, x, y, number);
		// this.drawNegativePts(this._gameCtx, x, y, number)
	// }
	
	// drawNegativePts(ctx, x, y, number)
	// {
		// const cardInfo = this.getCardInfo(number);
		// const negativePts = cardInfo.negativePts;
		// const centreX = x + this._cardWidth/2;
		// const bottomOfTheCowY = y + cowAndNumberAreThisPercentDownTheCard*this._cardHeight + (cowIsThisFractionOfCardHeight/2)*this._cardHeight;
		// const sizeOfGapBetweenCowAndBottomOfCard = this._cardHeight - (bottomOfTheCowY - y);
		// const centreY = bottomOfTheCowY + (sizeOfGapBetweenCowAndBottomOfCard/2);
		
		// const cowWidth = sizeOfGapBetweenCowAndBottomOfCard/2;
		// const cowHeight = sizeOfGapBetweenCowAndBottomOfCard/2;
		// const horizontalSpaceBetweenCows = cowWidth/2;
		// const verticalSpaceBetweenCows = cowHeight/3;
		
		// if (negativePts === 1)
					// this.drawLittleCow(ctx, centreX, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		// else if (negativePts === 2)
		// {
					// this.drawLittleCow(ctx, centreX - horizontalSpaceBetweenCows, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX + horizontalSpaceBetweenCows, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		// }
		// else if (negativePts === 3)
		// {
					// this.drawLittleCow(ctx, centreX, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX - cowWidth, centreY, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX + cowWidth, centreY, cowWidth, cowHeight, cardInfo.cowColor);
		// }
		// else if (negativePts === 5)
		// {
					// this.drawLittleCow(ctx, centreX, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX - cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX + cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					
					// this.drawLittleCow(ctx, centreX - horizontalSpaceBetweenCows, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX + horizontalSpaceBetweenCows, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
		// }
		// else if (negativePts === 7)
		// {
					// this.drawLittleCow(ctx, centreX - horizontalSpaceBetweenCows, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX + horizontalSpaceBetweenCows, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX - horizontalSpaceBetweenCows - cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX + horizontalSpaceBetweenCows + cowWidth, centreY - verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					
					// this.drawLittleCow(ctx, centreX, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX - cowWidth, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
					// this.drawLittleCow(ctx, centreX + cowWidth, centreY + verticalSpaceBetweenCows, cowWidth, cowHeight, cardInfo.cowColor);
		// }
	// }

	// drawBlankCard(ctx, x, y, width, height, radius, number)
	// {
		// drawCardShape(ctx, x, y, width, height, radius);
		// this._gameCtx.fillStyle = this.getCardInfo(number).cardColor;
		// ctx.fill();
		// this._gameCtx.lineWidth = 1;
		// ctx.stroke();
		// ctx.closePath();
	// }
	
	// drawCardNumber(ctx, x, y, number)
	// {
		// const fontPixels = 0.5*this._cardHeight;
		// ctx.font = "bold "+fontPixels+"px 'Comic Sans MS'";
		// ctx.textAlign = "center";
		// ctx.textBaseline = "middle";
		// const maximumFullNumberWidth = 0.9*this._cardWidth;
		// const centreXofNumber= x + (this._cardWidth/2);
		// const centreYofNumber = y+(this._cardHeight * cowAndNumberAreThisPercentDownTheCard);
		// ctx.lineWidth = 2;
		// ctx.fillStyle = this.getCardInfo(number).numColor;
		// ctx.fillText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
		// ctx.strokeText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
	// }

	// drawLittleCow(ctx, centreX, centreY, cowWidth, cowHeight, fillColor)
	// {
		// drawsimplifiedCowShape(ctx, centreX, centreY, cowWidth, cowHeight)
		// ctx.fillStyle = fillColor;
		// ctx.fill();
		// ctx.closePath();
	// }

	// drawBigCow(ctx, x, y, number)
	// {
		// const cowWidth = cowIsThisFractionOfCardWidth*this._cardWidth;
		// const cowHeight = cowIsThisFractionOfCardHeight*this._cardHeight;
		
		// // center of the cow
		// const centreX = x + this._cardWidth/2;
		// const centreY = y + this._cardHeight * cowAndNumberAreThisPercentDownTheCard;
		
		// drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight);
		// ctx.fillStyle = this.getCardInfo(number).cowColor;
		// ctx.fill();
		// ctx.lineWidth = 1;
		// ctx.stroke();
		// ctx.closePath();
	// }
	
	// calculateCardDimensions()
	// {
		// this._cardWidth = (this._gameCanvas.width - ((spaceInCanvasesForThisNumberOfCols + 1)*margin)) / spaceInCanvasesForThisNumberOfCols;
		// this._cardHeight = (this._gameCanvas.height - ((spaceInCanvasesForThisNumberOfRows + 1)*margin)) / spaceInCanvasesForThisNumberOfRows;
	// }
	
	// getCardInfo(cardNumber)
	// {
		// if (cardNumber === 55)
			// return {negativePts: 7, cowColor: "red", numColor: "yellow", cardColor: "purple"};
		// else if ( cardNumber % 11 === 0)
			// return {negativePts: 5, cowColor: "blue", numColor: "#ffbc00", cardColor: "red"};
		// else if (cardNumber % 10 === 0)
			// return {negativePts: 3, cowColor: "red", numColor: "#85c7e0", cardColor: "#ffbc00"};
		// else if (cardNumber % 5 === 0)
			// return {negativePts: 2, cowColor: "blue", numColor: "yellow", cardColor: "#85c7e0"};
		// else
			// return {negativePts: 1, cowColor: "#7f5093", numColor: "white", cardColor: "white"};
	// }
	

}