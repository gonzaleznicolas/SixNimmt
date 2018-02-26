"use strict";

class MenuView
{
	constructor()
	{
		$('#test')[0].addEventListener("click", this.hiClicked.bind(this), false);
		this._menuElement = $('#menu');
		this._menuElement.remove();
		this._menuButton = $("#menuButton");

		this._bIsMenuOn = false;
		
		this._menuButton[0].addEventListener("click", this.menuButtonClicked.bind(this), false);
		document.addEventListener("click", this.documentClicked.bind(this), true);
	}
	
	menuButtonClicked(event)
	{
		if (!this._bIsMenuOn)
		{
			$('header').after(this._menuElement);
			this._bIsMenuOn = true;
		}
		event.stopPropagation();
	}
	
	documentClicked(event)
	{
		if (this._bIsMenuOn)
		{ 
			if(!$(event.target).closest('#menu').length) {
				this._menuElement.remove();
				this._bIsMenuOn = false;
				event.stopPropagation();
			}
		}
	}
	
	hiClicked()
	{
		let i = 6;
	}
}