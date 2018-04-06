"use strict";

class Dialog
{
	constructor(prompt, option1Text, option1handler, option2Text, option2handler)
	{
		this._dialogElement = $(document.createElement("div")).addClass("dialog");
		this._dialogButtonContainer = $(document.createElement("div")).addClass("dialogButtonContainer");

		this._promptElement = $(document.createElement("p")).addClass("dialogPrompt");
		this._promptElement[0].innerHTML = prompt;

		this._dialogElement.append(this._promptElement);
		this._dialogElement.append(this._dialogButtonContainer);

		if (option1Text)
		{
			this._option1Element = $(document.createElement("div")).addClass("button");
			this._option1Element[0].innerHTML = option1Text;
			this._option1Element.click(option1handler);
			this._option1Element.click(function(){this.remove()}.bind(this._dialogElement)); // close dialog
			this._dialogButtonContainer.append(this._option1Element);
		}

		if (option2Text)
		{
			this._option2Element = $(document.createElement("div")).addClass("button");
			this._option2Element[0].innerHTML = option2Text;
			this._option2Element.click(option2handler);
			this._option2Element.click(function(){this.remove()}.bind(this._dialogElement)); // close dialog
			this._dialogButtonContainer.append(this._option2Element);
		}
		
		$("body").append(this._dialogElement);
	}
}
