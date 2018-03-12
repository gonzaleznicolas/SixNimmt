"use strict";

class HandAnimation extends Animation
{
	constructor(model)
	{
		super(new HandDrawer($('#handCanvas')[0], model), model);
	}
	
	fadeAwayCard(row, col)
	{
		bAnimationInProgress = true;
		this._fadeIteration = 0;
		this._fadeX = this._drawer._cardCoordinates[row][col].x;
		this._fadeY = this._drawer._cardCoordinates[row][col].y;
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