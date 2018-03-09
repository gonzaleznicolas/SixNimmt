"use strict";

class TableView
{
		constructor(sixNimmtModel)
		{
			this._tableDrawer = new TableDrawer($('#tableCanvas')[0], sixNimmtModel);
			this._tableAnimation = new TableAnimation(this._tableDrawer);
		}
		
		resize()
		{
			this._tableDrawer.resize();
		}
		
		draw()
		{
			this._tableDrawer.draw();
		}

}