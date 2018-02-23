"use strict";

// desing parameters
const spaceForOneFlickityArrow = 65;
const cardHeightToWidthFactor = 3/4;
const spaceInGameCanvasForThisNumberOfRows = 4;
const spaceInGameCanvasForThisNumberOfCols = 7;	// 6 for the game, one extra col for the upcoming cards
const numberOfColsInHandCanvas = 5;
const numberOfRowsInHandCanvas = 2;
const margin = 10; // pixels
const extraNumberOfMarginsBetween6thColAndLastCol = 6;
const radius = 10;
const cowIsThisFractionOfCardHeight = 2/3;
const cowIsThisFractionOfCardWidth = 9/10;
const cowIsThisPercentDownTheCard = 0.43;
const numberIsThisPercentDownTheCard = 0.5;
const minScoreboardWidthWhenOnSide = 100; //px
const maxScoreboardWidthWhenOnSide = 200;

class SixNimmtView
{
	constructor(sixNimmtModel) {
		this._gallery = $('.gallery')[0];
		this._flickity = this.setUpFlickity();
		this._gameCanvasDrawer = new GameCanvasDrawer($('#gameCanvas')[0]);
		this._handCanvasDrawer = new HandCanvasDrawer($('#handCanvas')[0]);
		this._gameAnimation = new GameAnimation(this._gameCanvasDrawer);
		this._handAnimation = new HandAnimation(this._handCanvasDrawer);

		this._scoreboard = new Scoreboard(["Nico", "Nata", "Erin", "Catalina Gonzalez", "Nico", "Nata", "Erin", "Catalina Gonzalez", "Nico", "Nata", "Erin", "Catalina Gonzalez"]);
		
		this.onResizeWindowHelper();
		this._resizeTimeout = undefined;
		$(window).on("resize", this.onResizeWindow.bind(this));	// i have to bind(this) because otherwise when onResizeWindow is called,
															// 'this' will be window, not this object, and it wont find setCanvasSize.
															// event handlers are by default called with 'this' set to the window object
		$(window).on("orientationchange", this.onResizeWindow.bind(this));
	}
	
	setUpFlickity()
	{
		const flickity = new Flickity( this._gallery, { cellAlign: 'center', contain: true, wrapAround: true, pageDots: false} );
		return flickity;
	}
	
	recalcGallerySize()
	{
		const widerCanvas = Math.max(this._gameCanvasDrawer.canvasWidth, this._handCanvasDrawer.canvasWidth);
		const galleryWidth = widerCanvas + 2*spaceForOneFlickityArrow;
		$(this._gallery).css("width", galleryWidth+"px"); // make it the wider canvas + 2* space for arrows
		this._flickity.resize();	// the gallery sets its height to fit the tallest galleryCell. But you need to call resize for it to redraw.
	}
	
	onResizeWindowHelper()
	{
		$("#game").css("visibility", "hidden"); 

		this._gameCanvasDrawer.resize();
		this._handCanvasDrawer.resize(this._gameCanvasDrawer._cardHeight);
		
		// better to calculate gallery dimensions from the game canvas than to use jQuery on the gallery object. That was causing bugs.
		this._scoreboard.resize(this._gameCanvasDrawer._canvas.width + 2*spaceForOneFlickityArrow, this._gameCanvasDrawer._canvas.height);
		this.recalcGallerySize();

		this._gameCanvasDrawer.draw();
		this._handCanvasDrawer.draw();
		this._scoreboard.draw();
		
		$("#game").css("visibility", "visible"); 
	}
	
	onResizeWindow()
	{
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.onResizeWindowHelper.bind(this), 500);
	}

}
