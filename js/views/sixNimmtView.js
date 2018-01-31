class SixNimmtView {
  constructor(sixNimmtModel) {
		
		this._flickity = this.setUpFlickity();
		
		this._gameCanvas = $('#canvas0')[0];
		this._handCanvas = $('#canvas1')[0];
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
		this._gameCanvas.width = 200;
	}
}