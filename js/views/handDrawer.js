"use strict"; 
 
class HandDrawer extends Drawer 
{ 
	constructor(canvas) 
	{ 
		super(canvas); 
		this._numberOfRows = numberOfRowsOnHandCanvas; 
		this._numberOfCols = numberOfColsOnHandCanvas; 
		this._currentlySelected = undefined;	// undefined means nothing selected 
		 
		this._playCardButton = $('#playCardButton'); 
		this._selectCardMessage = $('#selectCardMessage'); 
		this._playCardButton.css("margin-left", margin + "px");	// couldnt be set using pure css 
		this._selectCardMessage.css("margin-left", margin + "px");	// couldnt be set using pure css 
		$('#playCardButton').remove(); 
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
			$('#playCardButton').remove(); 
			$('#handWrapper').append(this._selectCardMessage); 
		} 
		else 
		{ 
			this.dimAll(); 
			const card = this._cardCoordinates[this._currentlySelected.row][this._currentlySelected.col]; 
			this.drawCard(card.x, card.y, this._cardWidth, 44); 
			$('#selectCardMessage').remove(); 
			$('#playCardButton').remove(); 
			$('#handWrapper').append(this._playCardButton); 
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
	 
	resize(galleryWidth, galleryHeight) 
	{
		this.setCanvasAndCardDimensions(galleryWidth - 2*deFactoSpaceForOneFlickityArrow, (1 - percentageOfGalleryHeightLeftForThePlayCardButtonBelowHandCanvas)*galleryHeight);
		this.calculateCardCoordinates(); 
		// update play card button 
		$('#handWrapper').css("font-size", this._cardHeight*0.2 + "px"); 
	} 
	 
	setCanvasAndCardDimensions(maxWidth, maxHeight) 
	{
		/* step 1: find out what the canvas height would be if we set the canvas width to the maxWidth:
		We know cardWidth = cardHeight * cardHeightToWidthFactor
		Let canvasWidth = maxWidth
		Let maxWidth = (numberOfColsOnHandCanvas+1)*margin + numberOfColsOnHandCanvas*cardWidth
		so we can solve for the card height: */
		let canvasWidth = maxWidth;
		let cardHeight = (canvasWidth - (numberOfColsOnHandCanvas+1)*margin)/(numberOfColsOnHandCanvas*cardHeightToWidthFactor);
		// from the card height, we can find the canvas height
		let canvasHeight = (numberOfRowsOnHandCanvas)*cardHeight + (numberOfRowsOnHandCanvas+1)*margin;
		
		/* step 2: if by making the width the maxWidth, we made the canvas too tall, then set the height to the maxHeight instead and repeat the process*/
		if (canvasHeight > maxHeight)
		{
			canvasHeight = maxHeight;
			cardHeight = (maxHeight - (numberOfRowsOnHandCanvas+1)*margin)/(numberOfRowsOnHandCanvas);
			canvasWidth = (numberOfColsOnHandCanvas+1)*margin + numberOfColsOnHandCanvas*cardHeightToWidthFactor*cardHeight;
		}
		
		this._cardHeight = cardHeight;
		this._cardWidth = cardHeight*cardHeightToWidthFactor;
		
		this._canvas.width = canvasWidth; 
		this._canvas.height = canvasHeight; 
	}
}
