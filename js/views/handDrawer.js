"use strict"; 
 
class HandDrawer extends Drawer 
{ 
	constructor(canvas) 
	{ 
		super(canvas); 
		this._numberOfRows = lc.numberOfRowsOnHandCanvas; 
		this._numberOfCols = lc.numberOfColsOnHandCanvas ; 
		this._currentlySelected = undefined;	// undefined means nothing selected 
		 
		this._playCardButton = $('#playCardButton'); 
		this._selectCardMessage = $('#selectCardMessage'); 
		this._playCardButton.css("margin-left", lc.margin + "px");	// couldnt be set using pure css 
		this._selectCardMessage.css("margin-left", lc.margin + "px");	// couldnt be set using pure css 
	} 
	 
	draw() 
	{	 
		for (let row = 0; row < this._numberOfRows; row++) 
		{ 
			for (let col = 0; col < this._numberOfCols; col++) 
			{ 
				this.drawCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y, this._cardWidth, row*col+col+30); 
			} 
		} 
		 
		this.updateBasedOnCardSelection(); 
	} 
 
	updateBasedOnCardSelection() 
	{ 
		if (this._currentlySelected == undefined) 
		{ 
			this._playCardButton.hide(); 
			this._selectCardMessage.show(); 
		} 
		else 
		{ 
			this.dimAll(); 
			const card = this._cardCoordinates[this._currentlySelected.row][this._currentlySelected.col]; 
			this.drawCard(card.x, card.y, this._cardWidth, 44); 
			this._selectCardMessage.hide(); 
			this._playCardButton.show(); 
		} 
	} 
 
	dimAll() 
	{	 
		for (let row = 0; row < this._numberOfRows; row++) 
		{ 
			for (let col = 0; col < this._numberOfCols; col++) 
			{ 
				this.dimCard(this._cardCoordinates[row][col].x, this._cardCoordinates[row][col].y); 
			} 
		} 
	} 
	 
	resize() 
	{
		this.setCanvasAndCardDimensions(lc.galleryWidth - 2*lc.deFactoSpaceForOneFlickityArrow, (1 - lc.percentageOfGalleryHeightLeftForThePlayCardButtonBelowHandCanvas)*lc.galleryHeight);
		this.calculateCardCoordinates(); 
		// update play card button 
		$('#handWrapper').css("font-size", this._cardHeight*0.2 + "px"); 
	} 
	 
	setCanvasAndCardDimensions(maxWidth, maxHeight) 
	{
		/* step 1: find out what the canvas height would be if we set the canvas width to the maxWidth:
		We know cardWidth = cardHeight * lc.cardHeightToWidthFactor
		Let canvasWidth = maxWidth
		Let maxWidth = (lc.numberOfColsOnHandCanvas +1)*lc.margin + lc.numberOfColsOnHandCanvas *cardWidth
		so we can solve for the card height: */
		let canvasWidth = maxWidth;
		let cardHeight = (canvasWidth - (lc.numberOfColsOnHandCanvas +1)*lc.margin)/(lc.numberOfColsOnHandCanvas * lc.cardHeightToWidthFactor);
		// from the card height, we can find the canvas height
		let canvasHeight = (lc.numberOfRowsOnHandCanvas)*cardHeight + (lc.numberOfRowsOnHandCanvas+1)*lc.margin;
		
		/* step 2: if by making the width the maxWidth, we made the canvas too tall, then set the height to the maxHeight instead and repeat the process*/
		if (canvasHeight > maxHeight)
		{
			canvasHeight = maxHeight;
			cardHeight = (maxHeight - (lc.numberOfRowsOnHandCanvas+1)*lc.margin)/(lc.numberOfRowsOnHandCanvas);
			canvasWidth = (lc.numberOfColsOnHandCanvas +1)*lc.margin + lc.numberOfColsOnHandCanvas *lc.cardHeightToWidthFactor*cardHeight;
		}
		
		this._cardHeight = cardHeight;
		this._cardWidth = cardHeight*lc.cardHeightToWidthFactor;
		
		this._canvas.width = canvasWidth; 
		this._canvas.height = canvasHeight; 
	}
}
