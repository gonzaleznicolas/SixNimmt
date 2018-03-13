"use strict";

class SixNimmtController {
	constructor(sixNimmtModel, sixNimmtView, menuView)
	{
		this._sixNimmtModel = sixNimmtModel;
		this._sixNimmtView = sixNimmtView;
		this._menuView = menuView;
		
		this._tableAnimation = this._sixNimmtView.TableAnimation;
		this._handAnimation = this._sixNimmtView.HandAnimation;
		
		this._tableAnimation.Drawer.Canvas.addEventListener("click", this.onTableCanvasClicked.bind(this), false);
		this._handAnimation.Drawer.Canvas.addEventListener("click", this.onHandCanvasClicked.bind(this), false);
		$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
	}
	
	onTableCanvasClicked(event)
	{
		if (this._sixNimmtModel.TableState != TableState.SelectRowToTake)
			return;
		const canvasTop = this._tableAnimation.Drawer.getCanvasOffsetTop();
		const y = event.pageY - canvasTop;

		const clickedRow = this._tableAnimation.Drawer.getCardRowFromY(y);
		
		if (clickedRow == this._sixNimmtModel.SelectedRow)
		{
			this._sixNimmtModel.SelectedRow = undefined;
			this._tableAnimation.Drawer.draw();
		}
		else if (clickedRow != undefined)
		{
			this._sixNimmtModel.SelectedRow = clickedRow;
			this._tableAnimation.Drawer.draw();
		}
	}
	
	onHandCanvasClicked(event)
	{
		if (this._sixNimmtModel.HandState != HandState.PlayCard)
			return;
		const canvasLeft = this._handAnimation.Drawer.getCanvasOffsetLeft();
		const canvasTop = this._handAnimation.Drawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handAnimation.Drawer.getCardRowColFromXY(x, y);
		
		if (rowCol && this._sixNimmtModel.Hand[this._handAnimation.Drawer.handRowColToIndex(rowCol.row, rowCol.col)])
			this.toggleCardSelection(rowCol.row, rowCol.col);
	}
	
	toggleCardSelection(row, col)
	{
		if (this._sixNimmtModel.CurrentlySelectedCardInHand != undefined &&
				row == this._handAnimation.Drawer.handIndexToRow(this._sixNimmtModel.CurrentlySelectedCardInHand) &&
				col == this._handAnimation.Drawer.handIndexToCol(this._sixNimmtModel.CurrentlySelectedCardInHand))
		{
			this._sixNimmtModel.CurrentlySelectedCardInHand = undefined;
		}
		else
			this._sixNimmtModel.CurrentlySelectedCardInHand = this._handAnimation.Drawer.handRowColToIndex(row, col);
		
		this._handAnimation.Drawer.draw();
	}

	onPlayCardClicked()
	{
		// fade out played card
		let selectedCardRow = this._handAnimation.Drawer.handIndexToRow(this._sixNimmtModel.CurrentlySelectedCardInHand);
		let selectedCardCol = this._handAnimation.Drawer.handIndexToCol(this._sixNimmtModel.CurrentlySelectedCardInHand);
		this._handAnimation.fadeAwayCard(selectedCardRow, selectedCardCol);
		
		// move to table
		if (!bSpectatorMode && bFlickityEnabled)
			setTimeout(function(flickity) {flickity.select(0);}, 500, this._sixNimmtView.Flickity); // give time for the fade away
	}
}