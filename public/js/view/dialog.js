"use strict";

class Dialog
{
	constructor()
	{
		this._dialogElement = $(document.createElement("div")).addClass("dialog");
		this._dialogButtonContainer = $(document.createElement("div")).addClass("dialogButtonContainer");

		this._promptElement = $(document.createElement("p")).addClass("dialogPrompt");

		this._dialogElement.append(this._promptElement);
		this._dialogElement.append(this._dialogButtonContainer);


		this._option1Element = $(document.createElement("div")).addClass("button");
		this._option1Element.click(function(){
			this.close();
		}.bind(this));
		this._dialogButtonContainer.append(this._option1Element);

		this._option2Element = $(document.createElement("div")).addClass("button");
		this._option2Element.click(function(){
			this.close();
		}.bind(this));
		this._dialogButtonContainer.append(this._option2Element);

		this._dialogBackground = $(document.createElement("div")).addClass("dialogBackground");
	}

	set(prompt, option1Text, option1handler, option2Text, option2handler)
	{
		this._promptElement[0].innerHTML = prompt;
		if (option1Text)
		{
			this._option1Element[0].innerHTML = option1Text;
			this._option1Element.click(option1handler);
		}

		if (option2Text)
		{
			this._option2Element[0].innerHTML = option2Text;
			this._option2Element.click(option2handler);
		}

		$("body").append(this._dialogBackground);
		$("body").append(this._dialogElement);
	}

	close()
	{
		this._dialogElement.remove();
		this._dialogBackground.remove();
	}
}
