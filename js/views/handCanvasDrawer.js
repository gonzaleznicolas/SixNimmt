"use strict";

class HandCanvasDrawer extends CanvasDrawer
{
	constructor(canvas)
	{
		super(canvas);
		this._numberOfRows = numberOfRowsInHandCanvas;
		this._numberOfCols = numberOfColsInHandCanvas;
		this._currentlySelected = undefined;	// undefined means nothing selected
		this.createPlayCardAndPleaseSelectCardElements();
	}
	
	createPlayCardAndPleaseSelectCardElements(){
		// the reason for creating them here instead of in html, is that when we are in spectator mode
		// and the hand is not even drawn, we do not want these elements anywhere
		this._playCardButton = $(document.createElement("p")).addClass("playCardButton");
		this._playCardButton.css({
			'width': 'fit-content',
			'border-radius': '0.5em',
			'padding': '0.5em',
			'margin-left': margin+"px",
			'background': 'rgba(0, 0, 0, 0.3)',
			'color': 'rgba(255, 255, 255, 1)',
			'font-weight': '0.5em',
			'font-family': 'Comic Sans MS'
		});
		this._playCardButton[0].innerHTML = "Play Card";
		
		this._selectCardMessage = $(document.createElement("p")).addClass("selectCardMessage");
		this._selectCardMessage.css({
			'margin-left': margin+"px",
			'font-family': 'Comic Sans MS',
			'color': 'rgba(255, 255, 255, 1)'
		});
		this._selectCardMessage[0].innerHTML = "Please select a card to play";
		
		$('#handCanvasWrapper').append(this._selectCardMessage);
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
			$('.playCardButton').remove();
			$('#handCanvasWrapper').append(this._selectCardMessage);
		}
		else
		{
			this.dimAll();
			const card = this._cardCoordinates[this._currentlySelected.row][this._currentlySelected.col];
			this.drawCard(card.x, card.y, this._cardWidth, 44);
			$('.selectCardMessage').remove();
			$('.playCardButton').remove();
			$('#handCanvasWrapper').append(this._playCardButton);
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
	
	resize(gameCanvasCardHeight)
	{
		// Idea: based on the gameCanvasCardHeight, make the cards on the hand canvas
		// (spaceInGameCanvasForThisNumberOfCols/numberOfColsInHandCanvas)ths as big as the cards on the game canvas.
		// Once we know the hand canvas card dimensions, using the global margin we can calculate
		// the hand canvas dimensions based on how much space is necessary for two rows of 5 cards.
		this.calculateCardDimensions(gameCanvasCardHeight);
		this.setCanvasSize();
		this.calculateCardCoordinates();
		// update play card button
		$('#handCanvasWrapper').css("font-size", this._cardHeight*0.2 + "px");
	}
	
	calculateCardDimensions(gameCanvasCardHeight)
	{
		const gameCanvasCardWidth = cardHeightToWidthFactor * gameCanvasCardHeight;
		const gameCanvasToHandCanvasCardSizeFactor = (spaceInGameCanvasForThisNumberOfCols/numberOfColsInHandCanvas);
		this._cardWidth = gameCanvasToHandCanvasCardSizeFactor * gameCanvasCardWidth;
		this._cardHeight = gameCanvasToHandCanvasCardSizeFactor * gameCanvasCardHeight;
	}
	
	setCanvasSize()
	{	
		this._canvas.width = numberOfColsInHandCanvas*this._cardWidth + (numberOfColsInHandCanvas+1)*margin;
		this._canvas.height = numberOfRowsInHandCanvas*this._cardHeight + (numberOfRowsInHandCanvas+1)*margin;
	}
}