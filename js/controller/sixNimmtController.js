"use strict";

class SixNimmtController {
	constructor()
	{
		this._model = new SixNimmtModel();
		this._menuView = new MenuView();

		this._tableAnimation = new TableAnimation(this._model);
		if (!bSpectatorMode)
			this._handAnimation = new HandAnimation(this._model);
		
		this._gameLayoutController = new GameLayoutController(this._tableAnimation, this._handAnimation);
		
		this._tableAnimation.Drawer.Canvas.addEventListener("click", this.onTableCanvasClicked.bind(this), false);
		this._handAnimation.Drawer.Canvas.addEventListener("click", this.onHandCanvasClicked.bind(this), false);
		$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
	}
	
	onTableCanvasClicked(event)
	{
		if (this._model.TableState != TableState.SelectRowToTake)
			return;
		const canvasTop = this._tableAnimation.Drawer.getCanvasOffsetTop();
		const y = event.pageY - canvasTop;

		const clickedRow = this._tableAnimation.Drawer.getCardRowFromY(y);
		
		if (clickedRow == this._model.SelectedRow)
		{
			this._model.SelectedRow = undefined;
			this._tableAnimation.Drawer.draw();
		}
		else if (clickedRow != undefined)
		{
			this._model.SelectedRow = clickedRow;
			this._tableAnimation.Drawer.draw();
		}
	}
	
	onHandCanvasClicked(event)
	{
		if (this._model.HandState != HandState.PlayCard)
			return;
		const canvasLeft = this._handAnimation.Drawer.getCanvasOffsetLeft();
		const canvasTop = this._handAnimation.Drawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handAnimation.Drawer.getCardRowColFromXY(x, y);
		
		if (rowCol && this._model.Hand[this._handAnimation.Drawer.handRowColToIndex(rowCol.row, rowCol.col)])
			this.toggleCardSelection(rowCol.row, rowCol.col);
	}
	
	toggleCardSelection(row, col)
	{
		if (this._model.CurrentlySelectedCardInHand != undefined &&
				row == this._handAnimation.Drawer.handIndexToRow(this._model.CurrentlySelectedCardInHand) &&
				col == this._handAnimation.Drawer.handIndexToCol(this._model.CurrentlySelectedCardInHand))
		{
			this._model.CurrentlySelectedCardInHand = undefined;
		}
		else
			this._model.CurrentlySelectedCardInHand = this._handAnimation.Drawer.handRowColToIndex(row, col);
		
		this._handAnimation.Drawer.draw();
	}

	onPlayCardClicked()
	{
		// fade out played card
		let selectedCardRow = this._handAnimation.Drawer.handIndexToRow(this._model.CurrentlySelectedCardInHand);
		let selectedCardCol = this._handAnimation.Drawer.handIndexToCol(this._model.CurrentlySelectedCardInHand);
		this._handAnimation.fadeAwayCard(selectedCardRow, selectedCardCol);
		
		// move to table
		if (!bSpectatorMode && bFlickityEnabled)
			setTimeout(function(flickity) {flickity.select(0);}, 500, this._gameLayoutController.Flickity); // give time for the fade away
	}
}