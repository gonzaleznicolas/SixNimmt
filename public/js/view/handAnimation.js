"use strict";

class HandAnimation extends Animation
{
	constructor(model)
	{
		super(new HandDrawer(model), model);
	}
}