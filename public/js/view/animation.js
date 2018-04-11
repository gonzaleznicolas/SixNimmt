"use strict";

class Animation
{
	constructor(drawer, model)
	{
		this._drawer = drawer;
		this._model = model;

		// no two animations of the same animation object (there are two animation objects: table and hand) will 
		// ever occur at the same time. So the entire object can share a callback. The function to be called when the
		// current animation finishes. Each time an animation starts, it will set this._callback to the callback that was
		// passed in or to undefined if there was no callback specified.
		this._callback = undefined;
	}
	
	get Drawer() {return this._drawer;}
	
	fadeAwayCard(row, col, callback)
	{
		bAnimationInProgress = true;
		this._callback = callback;
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
			if (this._callback)
				this._callback();
		}
	}
}