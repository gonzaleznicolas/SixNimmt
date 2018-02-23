"use strict";

// desing parameters
const spaceForOneFlickityArrow = 65; // px
const cardHeightToWidthFactor = 3/4;
const spaceOnTableForThisNumberOfRows = 4;
const spaceOnTableForThisNumberOfCols = 7;	// 6 for the game, one extra col for the upcoming cards
const numberOfColsInHandCanvas = 5;
const numberOfRowsInHandCanvas = 2;
const margin = 10; // px
const extraNumberOfMarginsBetween6thColAndLastCol = 6;
const radius = 10; // px
const cowIsThisFractionOfCardHeight = 2/3;
const cowIsThisFractionOfCardWidth = 9/10;
const cowIsThisPercentDownTheCard = 0.43;
const numberIsThisPercentDownTheCard = 0.5;
const minScoreboardWidthWhenOnSide = 100; // px
const maxScoreboardWidthWhenOnSide = 200; // px

class SixNimmtView
{
	constructor(sixNimmtModel) {
		deFactoSpaceForOneFlickityArrow = bSpectatorMode ? 0 : spaceForOneFlickityArrow;
		
		this._gallery = $('.gallery');
		
		if (!bSpectatorMode)
			this._flickity = this.setUpFlickity();
		
		this._tableDrawer = new TableDrawer($('#tableCanvas')[0]);
		this._tableAnimation = new TableAnimation(this._tableDrawer);
		
		if (bSpectatorMode)
			$('.hand.galleryCell').remove();
		else
		{
			this._handDrawer = new HandDrawer($('#handCanvas')[0]);
			this._handAnimation = new HandAnimation(this._handDrawer);
		}

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
		let flickity = undefined;
		try{
			flickity = new Flickity( this._gallery[0], { cellAlign: 'center', contain: true, wrapAround: true, pageDots: false} );
		}
		catch (err)
		{
			console.log("There was an error initializing flickity. Will place table and hand on top of eachother rather than in a gallery.");
		}
		finally
		{
			if (!flickity)
				return undefined;
			return flickity;
		}
	}
	
	recalcGallerySize()
	{
		const widerCanvas = bSpectatorMode ? this._tableDrawer.canvasWidth : Math.max(this._tableDrawer.canvasWidth, this._handDrawer.canvasWidth);
		const galleryWidth = widerCanvas + 2*deFactoSpaceForOneFlickityArrow;
		this._gallery.css("width", galleryWidth+"px"); // make it the wider canvas + 2* space for arrows
		if (!bSpectatorMode && this._flickity)
			this._flickity.resize();	// the gallery sets its height to fit the tallest galleryCell. But you need to call resize for it to redraw.
	}
	
	onResizeWindowHelper()
	{
		$("#game").css("visibility", "hidden"); 

		this._tableDrawer.resize();
		if (!bSpectatorMode)
			this._handDrawer.resize(this._tableDrawer._cardHeight);
		
		// better to calculate gallery dimensions from the table canvas than to use jQuery on the gallery object. That was causing bugs.
		//this._scoreboard.resize(this._tableDrawer._canvas.width + 2*deFactoSpaceForOneFlickityArrow, this._tableDrawer._canvas.height);
		this.recalcGallerySize();

		this._tableDrawer.draw();
		if (!bSpectatorMode)
			this._handDrawer.draw();
		//this._scoreboard.draw();
		
		$("#game").css("visibility", "visible"); 
	}
	
	onResizeWindow()
	{
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.onResizeWindowHelper.bind(this), 500);
	}

}
