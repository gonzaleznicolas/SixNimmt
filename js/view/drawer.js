"use strict";

class Drawer
{
	constructor(canvas, model)
	{
		this._model = model;
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");

		this._cardWidth = undefined;
		this._cardHeight = undefined;
		this._numberOfRows = undefined;
		this._numberOfCols = undefined;
		this._cardCoordinates = [];	// at location [row][col] youll find an object {x: ___,y: ___} with the canvas coordinates of the top left corner of the card
	}
	
	getCardRowColFromXY(x, y)
	{
		let clickedRow = undefined;
		let clickedCol = undefined;
		// find which row this y belongs to
		for (let row = 0; row < this._numberOfRows; row++)
		{
			if (y >= this._cardCoordinates[row][0].y && y <= this._cardCoordinates[row][0].y + this._cardHeight)
			{
				clickedRow = row;
				break;
			}
				clickedRow = row;
		}
		
		// find which col this x belongs to
		for (let col = 0; col < this._numberOfCols; col++)
		{
			if (x >= this._cardCoordinates[0][col].x && x <= this._cardCoordinates[0][col].x + this._cardWidth)
			{
				clickedCol = col;
				break;
			}
		}
		
		if (clickedRow == undefined || clickedCol == undefined)
			return undefined;
		
		return {row: clickedRow, col:clickedCol};
	}
	
	calculateCardCoordinates()
	{
		let x = lc.margin;
		let y = lc.margin;
		for (let row = 0; row < this._numberOfRows; row++)
		{
			x = lc.margin;
			this._cardCoordinates[row] = [];
			for (let col = 0; col < this._numberOfCols; col++)
			{
				this._cardCoordinates[row][col] = {x: x, y: y};
				x = x + this._cardWidth + lc.margin;
			}
			y = y + this._cardHeight + lc.margin;
		}
	}
	
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
	
	dimCard(x, y)
	{
		const ctx = this._ctx;
		BasicShapeDrawer.drawCardShape(ctx, x, y, this._cardWidth, this._cardHeight, lc.radius);
		ctx.fillStyle = lc.nimmtPurple.substring(0, lc.nimmtPurple.indexOf("1)"))+"0.85)";
		ctx.fill();
		ctx.closePath();
	}
	
	drawBlankCard(x, y, cardWidth, number)
	{
		const ctx = this._ctx;
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, cardWidth, this._cardHeight, lc.radius);
		ctx.fillStyle = getCardInfo(number).cardColor;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.stroke();
		ctx.closePath();
	}
	
	drawBigCow(x, y, cardWidth, number)
	{
		const ctx = this._ctx;
		
		const cowWidth = lc.cowIsThisFractionOfCardWidth*cardWidth;
		const cowHeight = lc.cowIsThisFractionOfCardHeight*this._cardHeight;
		
		// center of the cow
		const centreX = x + cardWidth/2;
		
		// draw the big cow right in the middle if its a face down card
		const faceUpCard = number != undefined;
		const centreY = faceUpCard ? (y + this._cardHeight * lc.cowIsThisPercentDownTheCard) : (y + this._cardHeight/2);
		
		BasicShapeDrawer.drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight);
		ctx.fillStyle = getCardInfo(number).cowColor;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.stroke();
		ctx.closePath();
	}
	
	drawCardNumber(x, y, cardWidth, number)
	{
		const ctx = this._ctx;

		const fontPixels = 0.5*this._cardHeight;
		ctx.font = "bold "+fontPixels+"px Bangers";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const centreXofNumber= x + (cardWidth/2);
		const centreYofNumber = y+(this._cardHeight * lc.numberIsThisPercentDownTheCard);
		ctx.lineWidth = 2;
		ctx.fillStyle = getCardInfo(number).numColor;

		const textSize = ctx.measureText(number); // the size of the text if we let it be without setting a max width

		// textSize.width * (cardWidth/this._cardWidth) will be smaller when we are narrowing the card to flip it
		// 0.9*cardWidth will be smaller when we have a wide number like 104 and the card is normal size
		const maximumFullNumberWidth = Math.min(textSize.width * (cardWidth/this._cardWidth), 0.9*cardWidth);

		ctx.fillText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
		ctx.strokeText(number, centreXofNumber, centreYofNumber, maximumFullNumberWidth);
	}
	
	drawNegativePts(x, y, cardWidth, number)
	{
		const ctx = this._ctx;
		
		const cardInfo = getCardInfo(number);
		const negativePts = cardInfo.negativePts;
		const centreX = x + cardWidth/2;
		const bottomOfTheCowY = y + lc.cowIsThisPercentDownTheCard*this._cardHeight + (lc.cowIsThisFractionOfCardHeight/2)*this._cardHeight;
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

	clearCardSpace(x, y)
	{
		this._ctx.clearRect(x-2, y-2, this._cardWidth+4, this._cardHeight+4)
	}
	
	
	getCanvasOffsetLeft()
	{
		// because of how flickity works, to get the offset of the canvas we have to do it differently depending on whether flickity is enabled or not
		if (bSpectatorMode || !bFlickityEnabled)
			return this._canvas.offsetLeft;
		else
			return this._canvas.offsetLeft + $(".gallery")[0].offsetLeft;
	}

	getCanvasOffsetTop()
	{
		// because of how flickity works, to get the offset of the canvas we have to do it differently depending on whether flickity is enabled or not
		if (bSpectatorMode || !bFlickityEnabled)
			return this._canvas.offsetTop;
		else
			return this._canvas.offsetTop + $(".gallery")[0].offsetTop;
	}
}
