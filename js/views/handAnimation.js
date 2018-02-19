"use strict";

class HandAnimation
{
	constructor(drawer)
	{
			this._handCanvasDrawer = drawer;
			this._handCanvasDrawer._canvas.addEventListener("click", this.onCanvasClicked.bind(this), false);
			
			this._currentlySelected = undefined;	// undefined means nothing selected
	}
	
	toggleCardSelection(row, col, number)
	{
		this._handCanvasDrawer.draw();
		if (this._currentlySelected != undefined && row == this._currentlySelected.row && col == this._currentlySelected.col)
			this._currentlySelected = undefined;
		else
		{
			this._currentlySelected = {row: row, col: col};
			this._handCanvasDrawer.dimAll();
			const card = this._handCanvasDrawer._cardCoordinates[row][col];
			this._handCanvasDrawer.drawCard(card.x, card.y, this._handCanvasDrawer._cardWidth, 44);
		}
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