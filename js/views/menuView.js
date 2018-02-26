"use strict";

class MenuView
{
	constructor()
	{
		this._menuElement = $('#menu');
		this._menuElement.remove();
		this._menuButton = $("#menuButton");

		this._bIsMenuOn = false;
		
		this._menuButton[0].addEventListener("click", this.menuButtonClicked.bind(this), false);
	}
	
	menuButtonClicked(event)
	{
		if (this._bIsMenuOn)
			this.removeMenu();
		else
			this.showMenu();
		event.stopPropagation();
	}
	
	removeMenu()
	{
		this._menuElement.remove();
		this._bIsMenuOn = false;
	}
	
	showMenu()
	{
		$('header').after(this._menuElement);
		this._bIsMenuOn = true;
	}
}