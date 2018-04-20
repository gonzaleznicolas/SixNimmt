"use strict";

class MenuView
{
	constructor()
	{
		this._menuElement = $('#menu');
		this._menuBackground = $(document.createElement("div")).addClass("dimBackground");
		$('header').after(this._menuBackground);
		this._menuButton = $("#menuButton");
		
		this._menuButton[0].addEventListener("click", this.menuButtonClicked.bind(this), false);
		this._menuBackground[0].addEventListener("click", this.menuBackgroundClicked.bind(this), false);
		
		$('.menuOption')[0].addEventListener("click", this.menuButtonClicked.bind(this), false); // to close menu
	}
	
	showMenuButton()
	{
		this._menuButton.css("visibility", "visible");
	}
	
	hideMenuButton()
	{
		this._menuButton.css("visibility", "hidden");
		this._menuBackground.hide();
		this._menuElement.hide();
	}
	
	menuButtonClicked()
	{
		this._menuBackground.toggle();
		this._menuElement.toggle(300);
	}
	
	menuBackgroundClicked()
	{
		this._menuBackground.toggle();
		this._menuElement.hide(300);
	}
}
