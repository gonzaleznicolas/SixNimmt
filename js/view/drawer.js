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
	
	get Canvas() {return this._canvas;}
	get CardWidth() {return this._cardWidth;}
	
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
	drawCard(x, y, cardWidth, number, playerName = undefined)
	{
		this.drawBlankCard(x, y, cardWidth, number);
		
		if (playerName)
			this.drawPlayerName(x, y, cardWidth, number, playerName, true);
		else
			this.drawBigCow(x, y, cardWidth, number);
		this.drawCardNumber(x, y, cardWidth, number);
		this.drawNegativePts(x, y, cardWidth, number);
	}
	
	drawFaceDownCard(x, y, cardWidth, playerName = undefined)
	{
		this.drawBlankCard(x, y, cardWidth, undefined);
		this.drawBigCow(x, y, cardWidth, undefined);
		if (playerName)
			this.drawPlayerName(x, y, cardWidth, undefined, playerName, false);
	}
	
	dimCard(x, y, amount)
	{
		let halfMargin = lc.margin/2;
		const ctx = this._ctx;
		ctx.beginPath();
		ctx.rect(x-halfMargin, y-halfMargin, this._cardWidth+lc.margin, this._cardHeight+lc.margin);
		ctx.fillStyle = lc.nimmtPurple.substring(0, lc.nimmtPurple.indexOf("1)"))+amount+")";
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

		const centreY = y + this._cardHeight * lc.cowIsThisPercentDownTheCard;
		
		BasicShapeDrawer.drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight);
		
		const faceUpCard = number != undefined;
		ctx.fillStyle = faceUpCard ? getCardInfo(number).cowColor : lc.nimmtPurple;
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
		const fullNumberWidth = Math.min(textSize.width * (cardWidth/this._cardWidth), 0.9*cardWidth);

		ctx.fillText(number, centreXofNumber, centreYofNumber, fullNumberWidth);
		ctx.strokeText(number, centreXofNumber, centreYofNumber, fullNumberWidth);
	}
	
	drawPlayerName(x, y, cardWidth, number, playerName, bFaceUp)
	{
		const ctx = this._ctx;

		const fontPixels = 0.2*this._cardHeight;
		ctx.font = "bold "+fontPixels+"px Yanone Kaffeesatz";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const centreXofName= x + (cardWidth/2);
		const centreYofName = bFaceUp ? y+(this._cardHeight * lc.playerNameIsThisPercentDownTheCardWhenFaceUp) : y+(this._cardHeight * lc.playerNameIsThisPercentDownTheCardWhenFaceDown);


		const textSize = ctx.measureText(playerName); // the size of the text if we let it be without setting a max width

		// textSize.width * (cardWidth/this._cardWidth) will be smaller when we are narrowing the card to flip it
		// 0.9*cardWidth will be smaller when we have a wide playerName and the card is normal size
		const fullNameWidth = Math.min(textSize.width * (cardWidth/this._cardWidth), 0.9*cardWidth);
		
		const rectHeight = fontPixels*1.1;
		const rectWidth = fullNameWidth*1.15;
		const topOfRect = centreYofName - rectHeight*0.55;
		const leftOfRect = centreXofName - rectWidth/2;
		
		ctx.fillStyle = number ? getCardInfo(number).cowColor : lc.nimmtPurple;
		ctx.fillText(playerName, centreXofName, centreYofName, fullNameWidth);
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
		let halfMargin = lc.margin/2;
		this._ctx.clearRect(x-halfMargin, y-halfMargin, this._cardWidth+lc.margin, this._cardHeight+lc.margin);
	}
	
	clearExactCardSpace(x, y)
	{
		const ctx = this._ctx;
		
		BasicShapeDrawer.drawCardShape(ctx, x, y, this._cardWidth, this._cardHeight, lc.radius);
		ctx.fillStyle = lc.nimmtPurple;
		ctx.strokeStyle = lc.nimmtPurple;
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.closePath();
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
