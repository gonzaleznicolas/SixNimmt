"use strict";

class SixNimmtController {
	constructor(sixNimmtModel, sixNimmtView, menuView)
	{
		this._sixNimmtModel = sixNimmtModel;
		this._sixNimmtView = sixNimmtView;
		this._menuView = menuView;
		
		this._tableDrawer = this._sixNimmtView._tableDrawer;
		this._tableAnimation = this._sixNimmtView._tableAnimation;
		this._handDrawer = this._sixNimmtView._handDrawer;
		this._handAnimation = this._sixNimmtView._handAnimation;
		
		$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
		this._handDrawer._canvas.addEventListener("click", this.onHandCanvasClicked.bind(this), false);
	}
	
	onPlayCardClicked()
	{
		// fade out played card
		let selectedCardRow = this._handDrawer.handIndexToRow(this._sixNimmtModel.CurrentlySelectedCardInHand);
		let selectedCardCol = this._handDrawer.handIndexToCol(this._sixNimmtModel.CurrentlySelectedCardInHand);
		this._handAnimation.fadeAwayCard(selectedCardRow, selectedCardCol);
		
		// move to table
		if (!bSpectatorMode && bFlickityEnabled)
			setTimeout(function(flickity) {flickity.select(0);}, 500, this._sixNimmtView._flickity); // give time for the fade away
	}
	
	onHandCanvasClicked(event)
	{
		if (this._sixNimmtModel.HandState != HandState.PlayCard)
			return;
		const canvasLeft = this._handDrawer.getCanvasOffsetLeft();
		const canvasTop = this._handDrawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handDrawer.getCardRowColFromXY(x, y);
		
		if (rowCol && this._sixNimmtModel.Hand[this._handDrawer.handRowColToIndex(rowCol.row, rowCol.col)])
			this.toggleCardSelection(rowCol.row, rowCol.col);
	}
	
	toggleCardSelection(row, col)
	{
		if (this._sixNimmtModel.CurrentlySelectedCardInHand != undefined &&
				row == this._handDrawer.handIndexToRow(this._sixNimmtModel.CurrentlySelectedCardInHand) &&
				col == this._handDrawer.handIndexToCol(this._sixNimmtModel.CurrentlySelectedCardInHand))
		{
			this._sixNimmtModel.CurrentlySelectedCardInHand = undefined;
		}
		else
			this._sixNimmtModel.CurrentlySelectedCardInHand = this._handDrawer.handRowColToIndex(row, col);
		
		this._handDrawer.draw();
	}
}