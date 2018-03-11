"use strict";

class HandAnimation
{
	constructor(drawer)
	{
			this._handDrawer = drawer;
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
}