"use strict";

class MenuView
{
	constructor()
	{
		this._menuElement = $('#menu');
		this._menuBackground = $(document.createElement("div")).addClass("menuBackground");
		$('header').after(this._menuBackground);
		this._menuButton = $("#menuButton");
		
		this._menuButton[0].addEventListener("click", this.menuButtonClicked.bind(this), false);
		this._menuBackground[0].addEventListener("click", this.menuBackgroundClicked.bind(this), false);
		
		$('#quitMenuOption')[0].addEventListener("click", this.quit.bind(this), false);
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
	
	quit()
	{
		console.log("quit"); // temporary
	}
}
