class SixNimmtView {
  constructor(sixNimmtModel) {
		this._flickity = this.setUpFlickity();
		this._$canvases = $('canvas');
    this.setCanvasSize();
  }
	
	setUpFlickity()
	{
		const elem = document.querySelector('.gallery');
		const flickity = new Flickity( elem, { cellAlign: 'center', contain: true, wrapAround: true} );
		return flickity;
	}
	
	setCanvasSize(){
		
	}
}