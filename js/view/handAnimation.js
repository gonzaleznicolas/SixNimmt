"use strict";

class HandAnimation
{
	constructor(drawer)
	{
			this._handDrawer = drawer;
			this._handDrawer._canvas.addEventListener("click", this.onCanvasClicked.bind(this), false);
	}
	
	fadeAwayCard(row, col)
	{
		this._fadeIteration = 0;
		this._fadeX = this._handDrawer._cardCoordinates[row][col].x;
		this._fadeY = this._handDrawer._cardCoordinates[row][col].y;
		requestAnimationFrame(this.fadeAwayCardHelper.bind(this));
	}
	
	fadeAwayCardHelper()
	{
		if (this._fadeIteration < 30)
		{
			this._handDrawer.dimCard(this._fadeX, this._fadeY, 0.1);
			requestAnimationFrame(this.fadeAwayCardHelper.bind(this));
			this._fadeIteration++;
		}
		else
		{
			this._handDrawer.clearCardSpace(this._fadeX, this._fadeY);
		}
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