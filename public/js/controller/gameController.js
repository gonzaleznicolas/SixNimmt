"use strict";

class GameController {
	constructor(initializationData)
	{
		this._name = initializationData.name;
		bSpectatorMode = initializationData.isSpectator;
		numberOfPlayers = initializationData.playerList.length;
		let listOfPlayers = initializationData.playerList;
		let hand = initializationData.hand;
		let table = initializationData.table;

		if (bSpectatorMode)
			state = ClientStates.WaitForRestToPlayTheirCard;
		else
			state = ClientStates.ChooseCard;

		lc = new LayoutCalculator();
		
		this._model = new GameModel(hand, table);
		this._menuView = new MenuView();
		this._headerView = new HeaderView();
		this._scoreboardView = new ScoreboardView(listOfPlayers);
		this._tableView = new TableView(this._model);
		if (!bSpectatorMode)
			this._handView = new HandView(this._model);
		
		this._gameLayoutController = new GameLayoutController(this._scoreboardView, this._tableView, this._handView, this._menuView);
		this._roundController = new RoundController(this._tableView, this._handView, this._headerView, this._scoreboardView, this._model, this._name);

		if (!bSpectatorMode)
		{
			this._handView.Animation.Drawer.Canvas.addEventListener("click", this.onHandCanvasClicked.bind(this), false);
			$("#playCardButton")[0].addEventListener("click", this.onPlayCardClicked.bind(this), false);
		}

		// SERVER TO CLIENT - GAME EVENTS
		socket.on("serverUpcomingCards", this.onServerUpcomingCards.bind(this));
		socket.on("serverUpdatedHand", this.onServerUpdatedHand.bind(this));
		socket.on("serverStartRound", this.onServerStartRound.bind(this));
	}

	// FUNCTIONS CALLED WITHING THE GAME CONTROLLER
	
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

	// SERVER TO CLIENT - GAME EVENT HANDLERS

	onServerUpcomingCards(upcomingCards)
	{
		// check state is right. make new state for waiting for played card response
		if (state != ClientStates.WaitForRestToPlayTheirCard && state != ClientStates.ChooseCard)
		{
			console.log("serverUpcomingCards message received at unexpected time. Ignored.");
			return;
		}
		this._model.UpcomingCards = upcomingCards;
		this._tableView.draw();
	}

	onServerUpdatedHand(hand)
	{
		if (state != ClientStates.WaitForRestToPlayTheirCard && state != ClientStates.NotPastFormYet)
		{
			console.log("serverUpdatedHand message received at unexpected time. Ignored.");
			return;
		}
		this._model.Hand = hand;
		this._handView.draw();
	}

	onServerStartRound(data)
	{
		state = ClientStates.ChooseCard;

		this._model.Table = data.table;
		this._model.SelectedRow = undefined;

		this._model.BUpcomingCardsFaceUp = false;
		this._model.UpcomingCards = [];
		this._model.HighlightedUpcomingCard = undefined;

		this._tableView.draw();

		this._scoreboardView.setScoreboard(data.scoreboard);

		if (!bSpectatorMode && data.hand)
		{
			this._model.Hand = data.hand;
			this._model.CurrentlySelectedCardInHand = undefined;
			this._handView.draw();
		}

		if (!bSpectatorMode)
			this._headerView.set(selectACardToPlayStr);
	}

	// UI HANDLERS
	
	onHandCanvasClicked(event)
	{
		if (state != ClientStates.ChooseCard)
			return;
		const canvasLeft = this._handView.Animation.Drawer.getCanvasOffsetLeft();
		const canvasTop = this._handView.Animation.Drawer.getCanvasOffsetTop();

		const x = event.pageX - canvasLeft;
		const y = event.pageY - canvasTop;

		const rowCol = this._handView.Animation.Drawer.getCardRowColFromXY(x, y);
		
		if (rowCol && this._model.Hand[this._handView.Animation.Drawer.handRowColToIndex(rowCol.row, rowCol.col)])
			this.toggleCardSelection(rowCol.row, rowCol.col);
	}

	onPlayCardClicked()
	{
		// fade out played card
		let selectedCardRow = this._handView.Animation.Drawer.handIndexToRow(this._model.CurrentlySelectedCardInHand);
		let selectedCardCol = this._handView.Animation.Drawer.handIndexToCol(this._model.CurrentlySelectedCardInHand);
		let xy = this._handView.Animation.Drawer.CardCoordinates[selectedCardRow][selectedCardCol];
		this._handView.Animation.Drawer.clearCardSpace(xy.x, xy.y);
		
		// move to table
		this._gameLayoutController.Flickity.select(0);
		
		// tell server which card was played
		let playedCard = this._model.Hand[this._model.CurrentlySelectedCardInHand];
		state = ClientStates.WaitForRestToPlayTheirCard;
		this._headerView.clear();
		socket.emit('clientPlayCard', playedCard);
	}
}