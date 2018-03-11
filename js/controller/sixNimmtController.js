"use strict";

class SixNimmtController {
	constructor(sixNimmtModel, sixNimmtView, menuView)
	{
		this._sixNimmtModel = sixNimmtModel;
		this._sixNimmtView = sixNimmtView;
		this._menuView = menuView;
		
		$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
	}
	
	onPlayCardClicked()
	{
		// fade out played card
		let selectedCardRow = this._sixNimmtView._handDrawer._currentlySelected.row;
		let selectedCardCol = this._sixNimmtView._handDrawer._currentlySelected.col;
		this._sixNimmtView._handAnimation.fadeAwayCard(selectedCardRow, selectedCardCol);
		
		// move to table
		if (!bSpectatorMode && bFlickityEnabled)
			setTimeout(function(flickity) {flickity.select(0);}, 500, this._sixNimmtView._flickity);
	}
}