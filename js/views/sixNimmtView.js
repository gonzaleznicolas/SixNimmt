class SixNimmtView {
	constructor(sixNimmtModel) {
		this._gallery = $('.gallery')[0];
		this._flickity = this.setUpFlickity();
		this._gameCanvas = $('#gameCanvas')[0];
		this._handCanvas = $('#handCanvas')[0];
		this._gameCtx = this._gameCanvas.getContext("2d");
		this._handCtx = this._handCanvas.getContext("2d");
		
		this._resizeTimeout;
		this.setCanvasSize();
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
	
	setCanvasSize()
	{
		/*
		The reason I set canvasHeight = windowHeight*0.9 in case 2 whereas in case 1 i set galleryWidth = windowWidth,
		is that if the width of the canvas is just right, it looks fine, but if the height is exactly right, its hard to
		scroll perfectly to get the whole canvas in the window.
		
		Why the ration 16:21?
			The ratio of width:height of each card is going to be (3/4)x:1x
			The game always has 4 rows
			The game has at most 5 columns but i left space for 2 more columns: 1 for when the cards are placed in their
				row just before collecting the 5 cards, and one column worth of space to put the cards that everyone played
				right before putting them in the row that they belong in.
			
			So the dimensions of the canvas considering the number of cards and the dimensions of the cards (ignoring space between
			cards, that is accounted for later) can be derived this way:
				
				canvasWidth = 7 (3/4)x
				canvasHeight = 4x
				
				Therefore canvasHeight = 16/21 canvasWidth
		
		*/
		
		// Known variables
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();
		const spaceForOneFlickityArrow = 65;
		
		// CASE 1
		let galleryWidth = windowWidth;
		let canvasWidth = windowWidth - 2*spaceForOneFlickityArrow;
		let canvasHeight = (16/21)*canvasWidth;
		
		// if by setting galleryWidth = windowWidth and maintaining the ration we make the canvas taller than the screen
		if (canvasHeight > windowHeight)
		{
				// CASE 2
				canvasHeight = windowHeight*0.9;
				canvasWidth = (21/16)*canvasHeight;
				galleryWidth = canvasWidth + 2*spaceForOneFlickityArrow;
		}
		
		
		$(this._gallery).css("visibility", "hidden"); 
		
		$(this._gallery).css("width", galleryWidth+"px");
		this._gameCanvas.width = canvasWidth;
		this._gameCanvas.height = canvasHeight;
		this._handCanvas.width = canvasWidth;
		this._handCanvas.height = canvasHeight;

		this._flickity.resize();	// the gallery sets its height to fit the tallest galleryCell. But you need to call resize for it to redraw.
		console.log("Canvas resized...");
		
		$(this._gallery).css("visibility", "visible"); 

	}
	
	onResizeWindow()
	{
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.setCanvasSize.bind(this), 500);
	}
}