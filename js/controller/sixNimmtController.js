"use strict";

class SixNimmtController {
	constructor(sixNimmtModel, sixNimmtView, menuView)
	{
		this._sixNimmtModel = sixNimmtModel;
		this._sixNimmtView = sixNimmtView;
		this._menuView = menuView;
		
		this._tableAnimation = this._sixNimmtView.TableAnimation;
		this._handAnimation = this._sixNimmtView.HandAnimation;
		
		$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
		this._handAnimation._drawer.Canvas.addEventListener("click", this.onHandCanvasClicked.bind(this), false);
	}
	
	onPlayCardClicked()
	{
		// fade out played card
		let selectedCardRow = this._handAnimation._drawer.handIndexToRow(this._sixNimmtModel.CurrentlySelectedCardInHand);
		let selectedCardCol = this._handAnimation._drawer.handIndexToCol(this._sixNimmtModel.CurrentlySelectedCardInHand);
		this._handAnimation.fadeAwayCard(selectedCardRow, selectedCardCol);
		
		// move to table
		if (!bSpectatorMode && bFlickityEnabled)
			setTimeout(function(flickity) {flickity.select(0);}, 500, this._sixNimmtView.Flickity); // give time for the fade away
	}
	
	onHandCanvasClicked(event)
	{
		if (this._sixNimmtModel.HandState != HandState.PlayCard)
			return;
		const canvasLeft = this._handAnimation._drawer.getCanvasOffsetLeft();
		const canvasTop = this._handAnimation._drawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handAnimation._drawer.getCardRowColFromXY(x, y);
		
		if (rowCol && this._sixNimmtModel.Hand[this._handAnimation._drawer.handRowColToIndex(rowCol.row, rowCol.col)])
			this.toggleCardSelection(rowCol.row, rowCol.col);
	}
	
	toggleCardSelection(row, col)
	{
		if (this._sixNimmtModel.CurrentlySelectedCardInHand != undefined &&
				row == this._handAnimation._drawer.handIndexToRow(this._sixNimmtModel.CurrentlySelectedCardInHand) &&
				col == this._handAnimation._drawer.handIndexToCol(this._sixNimmtModel.CurrentlySelectedCardInHand))
		{
			this._sixNimmtModel.CurrentlySelectedCardInHand = undefined;
		}
		else
			this._sixNimmtModel.CurrentlySelectedCardInHand = this._handAnimation._drawer.handRowColToIndex(row, col);
		
		this._handAnimation._drawer.draw();
	}
}