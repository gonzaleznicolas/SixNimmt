"use strict";

class SixNimmtView
{
	constructor(sixNimmtModel) {
		lc.deFactoSpaceForOneFlickityArrow = bSpectatorMode ? 0 : lc.spaceForOneFlickityArrow;
		lc.additionalColsOnTableCanvasForCardsPlayedThisTurn = Math.ceil(numberOfPlayers/lc.numberOfRowsOnTableCanvas);
		lc.totalNumberOfColsOnTableCanvas = lc.numberOfColsOnTableCanvasNotIncludingColsForCardsPlayedThisTurn  + lc.additionalColsOnTableCanvasForCardsPlayedThisTurn;
		
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
	
	setGallerySize()
	{
		this._gallery.css("width", lc.galleryWidth+"px");
		if (!bSpectatorMode && this._flickity)
			this._flickity.resize();	// the gallery sets its height to fit the tallest galleryCell. But you need to call resize for it to redraw.
	}
	
	onResizeWindowHelper()
	{
		lc.calculate();
		$("#game").css("visibility", "hidden"); 
		
		if (lc.bScoreboardBelowGallery)
			$("#game").css("flex-direction", "column");
		else
			$("#game").css("flex-direction", "row");

		this._tableDrawer.resize();
		if (!bSpectatorMode)
			this._handDrawer.resize();
		
		this._scoreboard.resize();
		this.setGallerySize();

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
