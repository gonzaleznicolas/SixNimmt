"use strict";

class SixNimmtView
{
	constructor(sixNimmtModel) {
		lc.deFactoSpaceForOneFlickityArrow = bSpectatorMode || !bFlickityEnabled ? 0 : lc.spaceForOneFlickityArrow;
		lc.additionalColsOnTableCanvasForCardsPlayedThisTurn = Math.ceil(numberOfPlayers/NUMBER_OF_ROWS_ON_TABLE_CANVAS);
		lc.totalNumberOfColsOnTableCanvas = NUMBER_OF_COLS_ON_TABLE_CANVAS_NOT_INCLUDING_COLS_FOR_CARDS_PLAYED_THIS_TURN + lc.additionalColsOnTableCanvasForCardsPlayedThisTurn;
		lc.calculate();
		this._gallery = $('.gallery');
		
		if (!bSpectatorMode)
			this._flickity = this.setUpFlickity();
		
		this._tableAnimation = new TableAnimation(sixNimmtModel);
		
		if (bSpectatorMode)
			$('.hand.galleryCell').remove();
		else
			this._handAnimation = new HandAnimation(sixNimmtModel);

		this._scoreboard = new Scoreboard(["Guillo", "Nata", "Nico", "MMMMMM", "Mateo", "Moises", "Jesus", "Jose", "Maria", "MMMMMM"]);
		
		this.onResizeWindowHelper();
		this._resizeTimeout = undefined;
		$(window).on("resize", this.onResizeWindow.bind(this));	// i have to bind(this) because otherwise when onResizeWindow is called,
															// 'this' will be window, not this object, and it wont find setCanvasSize.
															// event handlers are by default called with 'this' set to the window object
		$(window).on("orientationchange", this.onResizeWindow.bind(this));
	}
	
	get TableAnimation() {return this._tableAnimation;}
	get HandAnimation() {return this._handAnimation;}
	get Flickity() {return this._flickity;}
	
	setUpFlickity()
	{
		let flickity = undefined;
		try{
			if (bFlickityEnabled)
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

		this._tableAnimation._drawer.resize();
		if (!bSpectatorMode)
			this._handAnimation._drawer.resize();
		
		this._scoreboard.resize();
		this.setGallerySize();

		this._tableAnimation._drawer.draw();
		if (!bSpectatorMode)
			this._handAnimation._drawer.draw();
		
		$("#game").css("visibility", "visible"); 
	}
	
	onResizeWindow()
	{
		if (bAnimationInProgress)
		{
			setTimeout(this.onResizeWindow.bind(this), 500);
			return;
		}
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.onResizeWindowHelper.bind(this), 500);
	}

}
