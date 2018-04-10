"use strict";

class GameController {
	constructor(initializationData)
	{
		bSpectatorMode = initializationData.isSpectator;
		numberOfPlayers = initializationData.playerList.length;
		let listOfPlayers = initializationData.playerList;
		let hand = initializationData.hand;
		let table = initializationData.table;

		if (bSpectatorMode)
			state = ClientState.WaitForRestToPlayTheirCard;
		else
			state = ClientState.ChooseCard;

		lc = new LayoutCalculator();
		
		this._model = new GameModel(hand, table);
		this._menuView = new MenuView();

		this._scoreboardView = new ScoreboardView(listOfPlayers);
		this._tableView = new TableView(this._model);
		if (!bSpectatorMode)
			this._handView = new HandView(this._model);
		
		this._gameLayoutController = new GameLayoutController(this._scoreboardView, this._tableView, this._handView, this._menuView);
		
		this._tableView.Animation.Drawer.Canvas.addEventListener("click", this.onTableCanvasClicked.bind(this), false);
		if (!bSpectatorMode)
		{
				this._handView.Animation.Drawer.Canvas.addEventListener("click", this.onHandCanvasClicked.bind(this), false);
				$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
		}

		// SERVER TO CLIENT - GAME EVENTS
		socket.on("serverUpcomingCards", this.onServerUpcomingCards.bind(this));
	}

	// SERVER TO CLIENT - GAME EVENT HANDLERS
	onServerUpcomingCards(data)
	{
		// check state is right. make new state for waiting for played card response
		if (state != ClientState.WaitForRestToPlayTheirCard || state != ClientState.ChooseCard)
		{
			console.log("serverUpcomingCards message received at unexpected time. Ignored.");
			return;
		}
		this._model.UpcomingCards = data.cards;
		this._model.PlayerNamesOnUpcomingCards = data.namesOnCards;
		this._tableView.draw();
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
		if (state != ClientState.ChooseCard)
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
		
		// tell server which card was played
		let playedCard = this._model.Hand[this._model.CurrentlySelectedCardInHand];
		state = ClientState.WaitForRestToPlayTheirCard;
		socket.emit('clientPlayCard', playedCard);
	}
}