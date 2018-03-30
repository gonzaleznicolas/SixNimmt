"use strict";

class GameLayoutController
{
	constructor(scoreboardView, tableView, handView) {
		this.setAllStringsToChosenLanguage();
		
		lc.deFactoSpaceForOneFlickityArrow = bSpectatorMode || !bFlickityEnabled ? 0 : lc.spaceForOneFlickityArrow;
		lc.additionalColsOnTableCanvasForCardsPlayedThisTurn = Math.ceil(numberOfPlayers/NUMBER_OF_ROWS_ON_TABLE_CANVAS);
		lc.totalNumberOfColsOnTableCanvas = NUMBER_OF_COLS_ON_TABLE_CANVAS_NOT_INCLUDING_COLS_FOR_CARDS_PLAYED_THIS_TURN + lc.additionalColsOnTableCanvasForCardsPlayedThisTurn;
		lc.calculate();
		
		if (!bSpectatorMode)
			this._flickity = this.setUpFlickity();
		
		this._scoreboardView = scoreboardView;
		this._tableView = tableView;
		this._handView = handView; // could be undefined
		
		if (bSpectatorMode)
			$('.hand.galleryCell').remove();
		
		this.onResizeWindowHelper();
		this._resizeTimeout = undefined;
		$(window).on("resize", this.onResizeWindow.bind(this));	// i have to bind(this) because otherwise when onResizeWindow is called,
															// 'this' will be window, not this object, and it wont find setCanvasSize.
															// event handlers are by default called with 'this' set to the window object
		$(window).on("orientationchange", this.onResizeWindow.bind(this));
	}
	
	get Flickity() {return this._flickity;}
	
	setAllStringsToChosenLanguage()
	{
		if (bSpanish)
		{
			$('#quitMenuOption')[0].innerHTML = "Terminar Juego";
			$('#textRules')[0].innerHTML = "Reglas escritas";
			$('#videoRules')[0].innerHTML = "Reglas en video";

			$('#playCardButton')[0].innerHTML = "Poner Carta";
			$('#selectCardMessage')[0].innerHTML = "For favor elige una carta";
			$('#notTimeToPlayCardMessage')[0].innerHTML = "No es hora de elejir una carta";
		}
	}
	
	setUpFlickity()
	{
		let flickity = undefined;
		try{
			if (bFlickityEnabled)
				flickity = new Flickity( $('.gallery')[0], { cellAlign: 'center', contain: true, wrapAround: true, pageDots: false} );
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
		$('.gallery').css("width", lc.galleryWidth+"px");
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

		this._tableView.resize();
		if (!bSpectatorMode)
			this._handView.resize();
		
		this._scoreboardView.resize();
		this.setGallerySize();

		this._tableView.draw();
		if (!bSpectatorMode)
			this._handView.draw();
		
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
