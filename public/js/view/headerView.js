"use strict";

class HeaderView
{
	constructor()
	{
		this._headerText = $('#headerText');
		this._flashInterval = undefined;
	}

	set(str)
	{
		clearInterval(this._flashInterval);
		this._headerText.removeClass('pink');
		this._headerText[0].innerHTML = str;
	}

	setFlashing(str)
	{
		this._headerText[0].innerHTML = str;
		clearInterval(this._flashInterval);
		this._flashInterval = setInterval( function () {
			this._headerText.toggleClass('pink');
		}.bind(this), 1000);
	}
}
