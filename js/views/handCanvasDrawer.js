"use strict";

class HandCanvasDrawer extends CanvasDrawer
{
	constructor(canvas)
	{
		super(canvas);
	}
	
	setCanvasSize()
	{
		// Known variables
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();
		const spaceForOneFlickityArrow = 65;

		let canvasWidth = 10;
		let canvasHeight = 10;
		
		this._canvas.width = canvasWidth;
		this._canvas.height = canvasHeight;
	}
}