class SixNimmtView {
	constructor(sixNimmtModel) {
		
		this._flickity = this.setUpFlickity();
		
		this._gameCanvas = $('#gameCanvas')[0];
		this._handCanvas = $('#handCanvas')[0];
		this._gameCtx = this._gameCanvas.getContext("2d");
		this._handCtx = this._handCanvas.getContext("2d");
		this.setCanvasSize();
	}
	
	setUpFlickity()
	{
		const elem = document.querySelector('.gallery');
		const flickity = new Flickity( elem, { cellAlign: 'center', contain: true, wrapAround: true} );
		return flickity;
	}
	
	setCanvasSize()
	{
		let widthOfGalleryCell = $($(this._gameCanvas).parents(".galleryCell")[0]).width();
		this._gameCanvas.width = widthOfGalleryCell - 130;
		this._handCanvas.width = widthOfGalleryCell - 130;
	}
}