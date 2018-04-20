"use strict";

class Dialog
{
	constructor()
	{
		this._dialogElement = $(document.createElement("div")).addClass("dialog");
		this._promptElement = $(document.createElement("p")).addClass("dialogPrompt");
		this._dialogButtonContainer = $(document.createElement("div")).addClass("dialogButtonContainer");
		this._checkboxElement = $(document.createElement("label")).addClass("dialogCheckboxContainer");
		this._checkboxElement[0].innerHTML = "<input id=\"dialogCheckbox\" type=\"checkbox\"><span class=\"dialogCheckboxReplacement\"></span>";
		this._checkboxLabelText = $(document.createElement("p")).addClass("checkboxLabelText");
		this._checkboxElement.append(this._checkboxLabelText);

		this._dialogElement.append(this._promptElement);
		this._dialogElement.append(this._checkboxElement);
		this._dialogElement.append(this._dialogButtonContainer);

		this._option1Element = $(document.createElement("div")).addClass("button");
		this._dialogButtonContainer.append(this._option1Element);

		this._option2Element = $(document.createElement("div")).addClass("button");
		this._dialogButtonContainer.append(this._option2Element);

		this._dialogBackground = $(document.createElement("div")).addClass("dialogBackground");
	}

	// if a checkboxLabel (string), and checkboxHandler function are passed in, when either button is clicked,
	// the dialog will call the checkboxHandler with an argument true or false based on whether the checkbox was checked
	set(prompt, option1Text, option1handler, option2Text, option2handler, checkboxLabelText, checkboxHandler)
	{
		this._promptElement[0].innerHTML = prompt;
		if (option1Text)
		{
			this._option1Element[0].innerHTML = option1Text;
			this._option1Element.on('click', option1handler);
			if (checkboxHandler)
			{
				this._option1Element.on('click', function(){
					checkboxHandler($('#dialogCheckbox').prop('checked'));
				});
			}
			this._option1Element.on('click', function(){
				this.close();
			}.bind(this));
		}

		if (option2Text)
		{
			this._option2Element[0].innerHTML = option2Text;
			this._option2Element.on('click', option2handler);
			if (checkboxHandler)
			{
				this._option2Element.on('click', function(){
					checkboxHandler($('#dialogCheckbox').prop('checked'));
				});
			}
			this._option2Element.on('click', function(){
				this.close();
			}.bind(this));
			this._option2Element.show();
		}
		else
		{
			this._option2Element.hide();
		}

		if (checkboxLabelText)
		{
			this._checkboxLabelText[0].innerHTML = checkboxLabelText;
			this._checkboxElement.show();
		}
		else
		{
			this._checkboxElement.hide();
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
