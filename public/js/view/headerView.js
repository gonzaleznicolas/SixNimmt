"use strict";

class HeaderView
{
	constructor()
	{
		this._headerContent = $('#headerContent');
		this._flashInterval = undefined;
	}

	clear()
	{
		clearInterval(this._flashInterval);
		this._headerContent.empty();
	}

	set(str)
	{
		clearInterval(this._flashInterval);
		this._headerContent.removeClass('pink');
		this._headerContent.empty();
		this._headerContent[0].innerHTML = str;
	}

	setFlashing(str)
	{
		this._headerContent.empty();
		this._headerContent[0].innerHTML = str;
		clearInterval(this._flashInterval);
		this._flashInterval = setInterval( function () {
			this._headerContent.toggleClass('pink');
		}.bind(this), 1000);
	}

	setFlashingWithButton(str, buttonText, functionToCallWhenButtonPressed)
	{
		this._headerContent.empty();
		clearInterval(this._flashInterval);

		let text = $(document.createElement("div"));
		text.css("margin-right", "1em");
		text[0].innerHTML = str;
		this._headerContent.append(text);

		let button = $(document.createElement("div")).addClass('headerButton');
		button[0].innerHTML = buttonText;
		button.click(functionToCallWhenButtonPressed);
		this._headerContent.append(button);

		this._flashInterval = setInterval( function () {
			text.toggleClass('pink');
		}.bind(this), 1000);
	}
}
