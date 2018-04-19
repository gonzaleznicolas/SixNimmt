"use strict";

class Dialog
{
	constructor()
	{
		this._dialogElement = $(document.createElement("div")).addClass("dialog");
		this._promptElement = $(document.createElement("p")).addClass("dialogPrompt");
		this._dialogButtonContainer = $(document.createElement("div")).addClass("dialogButtonContainer");
		this._checkboxElement = $(document.createElement("label")).addClass("dialogCheckboxContainer");
		this._checkboxElement[0].innerHTML = "<input id=\"dialogCheckbox\" type=\"checkbox\"><span id=\"dialogCheckboxReplacement\"></span>Don't show this again";

		this._dialogElement.append(this._promptElement);
		this._dialogElement.append(this._checkboxElement);
		this._dialogElement.append(this._dialogButtonContainer);

		this._option1Element = $(document.createElement("div")).addClass("button");
		this._dialogButtonContainer.append(this._option1Element);

		this._option2Element = $(document.createElement("div")).addClass("button");
		this._dialogButtonContainer.append(this._option2Element);

		this._dialogBackground = $(document.createElement("div")).addClass("dialogBackground");
	}

	set(prompt, option1Text, option1handler, option2Text, option2handler)
	{
		this._promptElement[0].innerHTML = prompt;
		if (option1Text)
		{
			this._option1Element[0].innerHTML = option1Text;
			this._option1Element.on('click', option1handler);
			this._option1Element.on('click', function(){
				this.close();
			}.bind(this));
		}

		if (option2Text)
		{
			this._option2Element[0].innerHTML = option2Text;
			this._option2Element.on('click', option2handler);
			this._option2Element.on('click', function(){
				this.close();
			}.bind(this));
			this._option2Element.show();
		}
		else
		{
			this._option2Element.hide();
		}

		$("body").append(this._dialogBackground);
		$("body").append(this._dialogElement);
	}

	close()
	{
		this._option1Element.off(); // remove all event handlers
		this._option2Element.off(); // remove all event handlers
		this._dialogElement.remove();
		this._dialogBackground.remove();
	}
}
