"use strict";

class HandView
{
	constructor(model)
	{
		this._model = model;
		this._animation = new HandAnimation(this._model);
	}
	
	get Animation(){return this._animation;}

	updateMessage() 
	{ 
		if (state == ClientState.ChooseCard)
		{
			if (this._model.CurrentlySelectedCardInHand == undefined) 
			{ 
				$('#handMessageContainer').children().hide();
				$('#selectCardMessage').show(); 
			} 
			else 
			{
				$('#handMessageContainer').children().hide();
				$('#playCardButton').show();
			} 
		}
		else
		{
			$('#handMessageContainer').children().hide();
			$('#notTimeToPlayCardMessage').show(); 
		}
	}
	
	resize()
	{
		this._animation.Drawer.resize();
	}
	
	draw()
	{
		this._animation.Drawer.draw();
		this.updateMessage();
	}
}
