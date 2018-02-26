"use strict";

class MenuView
{
	constructor()
	{
		this._menuElement = $('#menu');
		this._menuElement.hide();
		this._menuButton = $("#menuButton");

		this._bIsMenuOn = false;
		
		this._menuButton[0].addEventListener("click", this.menuButtonClicked.bind(this), false);
	}
	
	menuButtonClicked(event)
	{
		this._menuElement.toggle(300);
	}
}