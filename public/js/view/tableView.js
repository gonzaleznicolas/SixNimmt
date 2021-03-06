"use strict";

class TableView
{
	constructor(model)
	{
		this._model = model;
		this._animation = new TableAnimation(this._model);
	}
	
	get Animation(){return this._animation;}
	
	resize()
	{
		this._animation.Drawer.resize();
	}
	
	draw()
	{
		this._animation.Drawer.draw();
	}
}
