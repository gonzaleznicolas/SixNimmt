"use strict";

const spaceForOneFlickityArrow = 65;

class SixNimmtView
{
	constructor(sixNimmtModel) {
		this._gallery = $('.gallery')[0];
		this._flickity = this.setUpFlickity();
		this._gameCanvasDrawer = new GameCanvasDrawer($('#gameCanvas')[0]);
		this._handCanvasDrawer = new HandCanvasDrawer($('#handCanvas')[0]);
		this._gameAnimation = new GameAnimation(this._gameCanvasDrawer);
		this._handAnimation = new HandAnimation(this._handCanvasDrawer);

		$('.playCardTable').css("margin-left", margin + "px");	// couldnt be set using pure css
		
		this.onResizeWindowHelper();
		this._resizeTimeout = undefined;
		$(window).on("resize", this.onResizeWindow.bind(this));	// i have to bind(this) because otherwise when onResizeWindow is called,
															// 'this' will be window, not this object, and it wont find setCanvasSize.
															// event handlers are by default called with 'this' set to the window object
		$(window).on("orientationchange", this.onResizeWindow.bind(this));
	}
	
	setUpFlickity()
	{
		const flickity = new Flickity( this._gallery, { cellAlign: 'center', contain: true, wrapAround: true} );
		return flickity;
	}
	
	recalcGallerySize()
	{
		const widerCanvas = Math.max(this._gameCanvasDrawer.canvasWidth, this._handCanvasDrawer.canvasWidth);
		const galleryWidth = widerCanvas + 2*spaceForOneFlickityArrow;
		$(this._gallery).css("width", galleryWidth+"px"); // make it the wider canvas + 2* space for arrows
		this._flickity.resize();	// the gallery sets its height to fit the tallest galleryCell. But you need to call resize for it to redraw.
	}
	
	placeAndSizeScoreBoard()
	{
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();

		const galleryWidth = this._gameCanvasDrawer._canvas.width + 2*spaceForOneFlickityArrow;
		const galleryHeight = this._gameCanvasDrawer._canvas.height;
		
		const spaceBelowGallery = Math.abs(galleryHeight - windowHeight);
		const spaceLeftOfGallery = Math.abs(galleryWidth - windowWidth);
		
		if (spaceLeftOfGallery >= spaceBelowGallery)
		{
			// place the scoreboard to the left of the gallery
			$("#game").css("flex-direction", "row-reverse");
			$("#scoreBoard").css("width", spaceLeftOfGallery + "px" );
			$("#scoreBoard").css("height", windowHeight + "px" );			
		}
		else
		{
			// place the scoreboard below the gallery
			$("#game").css("flex-direction", "column");
			$("#scoreBoard").css("width", windowWidth + "px" );
			$("#scoreBoard").css("height", spaceBelowGallery + "px" );	
		}
	}
	
	onResizeWindowHelper()
	{
		$(this._gallery).css("visibility", "hidden"); 

		// update game canvas
		this._gameCanvasDrawer.resize();

		// update hand canvas
		this._handCanvasDrawer.resize(this._gameCanvasDrawer._cardHeight);

		// update play card button
		$('.playCardTable').css("font-size", this._handCanvasDrawer._cardHeight*0.2 + "px");
		
		this.placeAndSizeScoreBoard();
		this.recalcGallerySize();
		
		this._gameCanvasDrawer.draw();
		this._handCanvasDrawer.draw();
		
		$(this._gallery).css("visibility", "visible"); 
	}
	
	onResizeWindow()
	{
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.onResizeWindowHelper.bind(this), 500);
	}

}
