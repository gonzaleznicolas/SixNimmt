"use strict";

class Animation
{
	constructor(drawer, model)
	{
		this._drawer = drawer;
		this._model = model;
	}
	
	get Drawer() {return this._drawer;}
	
	fadeAwayCard(row, col)
	{
		bAnimationInProgress = true;
		this._fadeIteration = 0;
		this._fadeX = this._drawer.CardCoordinates[row][col].x;
		this._fadeY = this._drawer.CardCoordinates[row][col].y;
		requestAnimationFrame(this.fadeAwayCardHelper.bind(this));
	}
	
	fadeAwayCardHelper()
	{
		if (this._fadeIteration < 30)
		{
			this._drawer.dimCard(this._fadeX, this._fadeY, 0.1);
			requestAnimationFrame(this.fadeAwayCardHelper.bind(this));
			this._fadeIteration++;
		}
		else
		{
			this._drawer.clearCardSpace(this._fadeX, this._fadeY);
			bAnimationInProgress = false;
		}
	}
}