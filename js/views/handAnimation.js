"use strict";

class HandAnimation
{
	constructor(drawer)
	{
			this._handCanvasDrawer = drawer;
			this._handCanvasDrawer._canvas.addEventListener("click", this.onCanvasClicked.bind(this), false);
	}
	
	toggleCardSelection(row, col, number)
	{
		let i = 5;
	}

	onCanvasClicked(event)
	{
		const canvasLeft = this._handCanvasDrawer.getCanvasOffsetLeft();
		const canvasTop = this._handCanvasDrawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handCanvasDrawer.getCardRowColFromXY(x, y);
		
		this.toggleCardSelection(rowCol.row, rowCol.col, Math.floor(Math.random()*20)+44);
	}
}