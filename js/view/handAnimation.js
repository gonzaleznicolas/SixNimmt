"use strict";

class HandAnimation
{
	constructor(drawer)
	{
			this._handDrawer = drawer;
			this._handDrawer._canvas.addEventListener("click", this.onCanvasClicked.bind(this), false);
	}
	
	toggleCardSelection(row, col)
	{
		if (this._handDrawer._currentlySelected != undefined &&
				row == this._handDrawer._currentlySelected.row &&
				col == this._handDrawer._currentlySelected.col)
		{
			this._handDrawer._currentlySelected = undefined;
		}
		else
			this._handDrawer._currentlySelected = {row: row, col: col};
		
		this._handDrawer.draw();
	}

	onCanvasClicked(event)
	{
		const canvasLeft = this._handDrawer.getCanvasOffsetLeft();
		const canvasTop = this._handDrawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handDrawer.getCardRowColFromXY(x, y);
		
		if (rowCol && this._handDrawer._model.Hand[this._handDrawer.handRowColToIndex(rowCol.row, rowCol.col)])
			this.toggleCardSelection(rowCol.row, rowCol.col);
	}
}