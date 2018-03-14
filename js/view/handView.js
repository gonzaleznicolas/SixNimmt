"use strict";

class HandView
{
	constructor(model)
	{
		this._model = model;
		this._animation = new HandAnimation(this._model);
	}
	
	get Animation(){return this._animation;}
}
