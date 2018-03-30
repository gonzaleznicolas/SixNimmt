"use strict";

class GameController {
	constructor()
	{
		lc = new LayoutCalculator();
		
		this._model = new GameModel();
		this._menuView = new MenuView();

		this._scoreboardView = new ScoreboardView(["Guillo", "Nata", "Nico", "MMMMMM", "Mateo", "Moises", "Jesus", "Jose", "Maria", "MMMMMM"]);
		this._tableView = new TableView(this._model);
		if (!bSpectatorMode)
			this._handView = new HandView(this._model);
		
		this._gameLayoutController = new GameLayoutController(this._scoreboardView, this._tableView, this._handView);
		
		this._tableView.Animation.Drawer.Canvas.addEventListener("click", this.onTableCanvasClicked.bind(this), false);
		if (!bSpectatorMode)
		{
				this._handView.Animation.Drawer.Canvas.addEventListener("click", this.onHandCanvasClicked.bind(this), false);
				$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
		}
	}
	
	onTableCanvasClicked(event)
	{
		if (this._model.TableState != TableState.SelectRowToTake)
			return;
		const canvasTop = this._tableView.Animation.Drawer.getCanvasOffsetTop();
		const y = event.pageY - canvasTop;

		const clickedRow = this._tableView.Animation.Drawer.getCardRowFromY(y);
		
		if (clickedRow == this._model.SelectedRow)
		{
			this._model.SelectedRow = undefined;
			this._tableView.draw();
		}
		else if (clickedRow != undefined)
		{
			this._model.SelectedRow = clickedRow;
			this._tableView.draw();
		}
	}
	
	onHandCanvasClicked(event)
	{
		if (this._model.HandState != HandState.PlayCard)
			return;
		const canvasLeft = this._handView.Animation.Drawer.getCanvasOffsetLeft();
		const canvasTop = this._handView.Animation.Drawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handView.Animation.Drawer.getCardRowColFromXY(x, y);
		
		if (rowCol && this._model.Hand[this._handView.Animation.Drawer.handRowColToIndex(rowCol.row, rowCol.col)])
			this.toggleCardSelection(rowCol.row, rowCol.col);
	}
	
	toggleCardSelection(row, col)
	{
		if (this._model.CurrentlySelectedCardInHand != undefined &&
				row == this._handView.Animation.Drawer.handIndexToRow(this._model.CurrentlySelectedCardInHand) &&
				col == this._handView.Animation.Drawer.handIndexToCol(this._model.CurrentlySelectedCardInHand))
		{
			this._model.CurrentlySelectedCardInHand = undefined;
		}
		else
			this._model.CurrentlySelectedCardInHand = this._handView.Animation.Drawer.handRowColToIndex(row, col);
		
		this._handView.draw();
	}

	onPlayCardClicked()
	{
		// fade out played card
		let selectedCardRow = this._handView.Animation.Drawer.handIndexToRow(this._model.CurrentlySelectedCardInHand);
		let selectedCardCol = this._handView.Animation.Drawer.handIndexToCol(this._model.CurrentlySelectedCardInHand);
		this._handView.Animation.fadeAwayCard(selectedCardRow, selectedCardCol);
		
		// move to table
		if (!bSpectatorMode && bFlickityEnabled)
			setTimeout(function(flickity) {flickity.select(0);}, 500, this._gameLayoutController.Flickity); // give time for the fade away
	}
}