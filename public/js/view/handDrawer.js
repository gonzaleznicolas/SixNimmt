"use strict"; 
 
class HandDrawer extends Drawer 
{ 
	constructor(model) 
	{ 
		super($('#handCanvas')[0], model); 
		this._numberOfRows = NUMBER_OF_ROWS_ON_HAND_CANVAS; 
		this._numberOfCols = NUMBER_OF_COLS_ON_HAND_CANVAS ;

		$('#handMessageContainer').css("margin-left", lc.margin + "px");	// couldnt be set using pure css 
	} 
	 
	draw() 
	{
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
		let numberOfCardsDrawn = 0;
		let cardNumber = undefined;
		for (let row = 0; row < this._numberOfRows && numberOfCardsDrawn < this._model.Hand.length ; row++) 
		{ 
			for (let col = 0; col < this._numberOfCols && numberOfCardsDrawn < this._model.Hand.length; col++) 
			{
				cardNumber = this._model.Hand[numberOfCardsDrawn];
				this.drawCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, this._cardWidth, cardNumber);
				
				if (state == ClientStates.ChooseCard
				&& this._model.CurrentlySelectedCardInHand != undefined
				&& this._model.CurrentlySelectedCardInHand != numberOfCardsDrawn)
				{
					this.dimCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, 0.85); 
				}
				numberOfCardsDrawn++;
			} 
		}
	}
	
	handIndexToRow(i)
	{
		return Math.floor(i/NUMBER_OF_COLS_ON_HAND_CANVAS);
	}

	handIndexToCol(i)
	{
		return i % NUMBER_OF_COLS_ON_HAND_CANVAS;
	}
	
	handRowColToIndex(row, col)
	{
		return NUMBER_OF_COLS_ON_HAND_CANVAS*row + col;
	}
	 
	resize() 
	{
		this.setCanvasAndCardDimensions(lc.galleryWidth - 2*lc.deFactoSpaceForOneFlickityArrow, (1 - lc.percentageOfGalleryHeightLeftForThePlayCardButtonBelowHandCanvas)*lc.galleryHeight);
		this.calculateCardCoordinates(); 
		// update play card button 
		$('#handContainer').css("font-size", this._cardHeight*0.2 + "px");
		// this is so when !bFlickityEnabled and the play card button / please play card message are at the bottom,
		// things arent jumping around because of the height difference between the play card button and the please play card message.
		$('#handContainer').css("height", lc.galleryHeight + "px");
	} 
	 
	setCanvasAndCardDimensions(maxWidth, maxHeight) 
	{
		/* step 1: find out what the canvas height would be if we set the canvas width to the maxWidth:
		We know cardWidth = cardHeight * lc.cardHeightToWidthFactor
		Let canvasWidth = maxWidth
		Let maxWidth = (this._numberOfCols +1)*lc.margin + this._numberOfCols *cardWidth
		so we can solve for the card height: */
		let canvasWidth = maxWidth;
		let cardHeight = (canvasWidth - (this._numberOfCols +1)*lc.margin)/(this._numberOfCols * lc.cardHeightToWidthFactor);
		// from the card height, we can find the canvas height
		let canvasHeight = (this._numberOfRows)*cardHeight + (this._numberOfRows+1)*lc.margin;
		
		/* step 2: if by making the width the maxWidth, we made the canvas too tall, then set the height to the maxHeight instead and repeat the process*/
		if (canvasHeight > maxHeight)
		{
			canvasHeight = maxHeight;
			cardHeight = (maxHeight - (this._numberOfRows+1)*lc.margin)/(this._numberOfRows);
			canvasWidth = (this._numberOfCols +1)*lc.margin + this._numberOfCols *lc.cardHeightToWidthFactor*cardHeight;
		}
		
		this._cardHeight = cardHeight;
		this._cardWidth = cardHeight*lc.cardHeightToWidthFactor;
		
		this._canvas.width = canvasWidth; 
		this._canvas.height = canvasHeight; 
	}
}
