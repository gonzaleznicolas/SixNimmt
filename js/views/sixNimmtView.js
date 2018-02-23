"use strict";

// desing parameters
const spaceForOneFlickityArrow = 65; // px
const cardHeightToWidthFactor = 3/4;
const spaceOnTableForThisNumberOfRows = 4;
const spaceOnTableForThisNumberOfCols = 7;	// 6 for the game, one extra col for the upcoming cards
const numberOfColsInHandCanvas = 5;
const numberOfRowsInHandCanvas = 2;
const margin = 10; // px
const extraNumberOfMarginsBetween6thColAndLastCol = 3;
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
			if (flickityEnabled)
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
	
	setGallerySize(galleryWidth)
	{
		this._gallery.css("width", galleryWidth+"px");
		if (!bSpectatorMode && this._flickity)
			this._flickity.resize();	// the gallery sets its height to fit the tallest galleryCell. But you need to call resize for it to redraw.
	}
	
	onResizeWindowHelper()
	{
		const s = LayoutCalculator.calculate();
		$("#game").css("visibility", "hidden"); 
		
		if (s.bScoreboardBelowGallery)
			$("#game").css("flex-direction", "column");
		else
			$("#game").css("flex-direction", "row");

		this._tableDrawer.resize(s.galleryWidth, s.galleryHeight);
		if (!bSpectatorMode)
			this._handDrawer.resize(this._tableDrawer._cardHeight);
		
		this._scoreboard.resize(s.scoreboardWidth, s.scoreboardHeight);
		this.setGallerySize(s.galleryWidth);

		this._tableDrawer.draw();
		if (!bSpectatorMode)
			this._handDrawer.draw();
		this._scoreboard.draw();
		
		$("#game").css("visibility", "visible"); 
	}
	
	onResizeWindow()
	{
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.onResizeWindowHelper.bind(this), 500);
	}

}
