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
		$(window).resize(this.onResizeWindow.bind(this));	// i have to bind(this) because otherwise when onResizeWindow is called,
															// 'this' will be window, not this object, and it wont find setCanvasSize.
															// event handlers are by default called with 'this' set to the window object
	}
	
	setUpFlickity()
	{
		const flickity = new Flickity( this._gallery, { cellAlign: 'center', contain: true, wrapAround: true} );
		return flickity;
	}
	
	setCanvasSize()
	{
		$(this._gallery).css("visibility", "hidden");
		let widthOfGalleryCell = $($(this._gameCanvas).parents(".galleryCell")[0]).width();
		this._gameCanvas.width = widthOfGalleryCell - 130;
		this._handCanvas.width = widthOfGalleryCell - 130;
		console.log("Canvas resized...");
		$(this._gallery).css("visibility", "visible");
	}
	
	onResizeWindow()
	{
		clearTimeout(this._resizeTimeout);
		this._resizeTimeout = setTimeout(this.setCanvasSize.bind(this), 500);
	}
}