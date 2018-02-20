"use strict";

class HandAnimation
{
	constructor(drawer)
	{
			this._handCanvasDrawer = drawer;
			this._handCanvasDrawer._canvas.addEventListener("click", this.onCanvasClicked.bind(this), false);
	}
	
	toggleCardSelection(row, col)
	{
		if (this._handCanvasDrawer._currentlySelected != undefined &&
				row == this._handCanvasDrawer._currentlySelected.row &&
				col == this._handCanvasDrawer._currentlySelected.col)
		{
			this._handCanvasDrawer._currentlySelected = undefined;
		}
		else
			this._handCanvasDrawer._currentlySelected = {row: row, col: col};
		
		this._handCanvasDrawer.draw();
	}

	onCanvasClicked(event)
	{
		const canvasLeft = this._handCanvasDrawer.getCanvasOffsetLeft();
		const canvasTop = this._handCanvasDrawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handCanvasDrawer.getCardRowColFromXY(x, y);
		
		this.toggleCardSelection(rowCol.row, rowCol.col);
	}
}