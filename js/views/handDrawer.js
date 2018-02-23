"use strict";

class HandDrawer extends Drawer
{
	constructor(canvas)
	{
		super(canvas);
		this._numberOfRows = numberOfRowsInHandCanvas;
		this._numberOfCols = numberOfColsInHandCanvas;
		this._currentlySelected = undefined;	// undefined means nothing selected
		
		this._playCardButton = $('#playCardButton');
		this._selectCardMessage = $('#selectCardMessage');
		this._playCardButton.css("margin-left", margin + "px");  // couldnt be set using pure css
		this._selectCardMessage.css("margin-left", margin + "px");  // couldnt be set using pure css
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
	
	resize(tableCardHeight)
	{
		// Idea: based on the tableCardHeight, make the cards on the hand canvas
		// (spaceIntableForThisNumberOfCols/numberOfColsInHandCanvas)ths as big as the cards on the table canvas.
		// Once we know the hand canvas card dimensions, using the global margin we can calculate
		// the hand canvas dimensions based on how much space is necessary for two rows of 5 cards.
		this.calculateCardDimensions(tableCardHeight);
		this.setCanvasSize();
		this.calculateCardCoordinates();
		// update play card button
		$('#handWrapper').css("font-size", this._cardHeight*0.2 + "px");
	}
	
	calculateCardDimensions(tableCardHeight)
	{
		const tableCardWidth = cardHeightToWidthFactor * tableCardHeight;
		const tableToHandCanvasCardSizeFactor = (spaceIntableForThisNumberOfCols/numberOfColsInHandCanvas);
		this._cardWidth = tableToHandCanvasCardSizeFactor * tableCardWidth;
		this._cardHeight = tableToHandCanvasCardSizeFactor * tableCardHeight;
	}
	
	setCanvasSize()
	{	
		this._canvas.width = numberOfColsInHandCanvas*this._cardWidth + (numberOfColsInHandCanvas+1)*margin;
		this._canvas.height = numberOfRowsInHandCanvas*this._cardHeight + (numberOfRowsInHandCanvas+1)*margin;
	}
}