"use strict";

class HandAnimation extends Animation
{
	constructor(model)
	{
		super(new HandDrawer($('#handCanvas')[0], model), model);
	}
}