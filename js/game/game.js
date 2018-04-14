'use strict';

const ArtificialPlayer = require('./participants/artificialPlayer.js');
const HumanPlayer = require('./participants/humanPlayer.js');
const Spectator = require('./participants/spectator.js');
const EventEmitter = require('events');
const GameStates = require('./gameGlobals.js').GameStates;
const PlayerStates = require('./gameGlobals.js').PlayerStates;
const Deck = require('./deck.js');
const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');
const GameLogic = require('./gameLogic.js');

module.exports = class Game extends EventEmitter
{
	constructor(gameCode, firstPlayerName, firstPlayerSocket)
	{
		super();
		this._state = GameStates.WaitForPlayers;
		this._gameCode = gameCode;
		this._open = true;
		this._players = new Map();
		this._spectators = [];
		this._deck = new Deck();
		this._table = new Table();
		this._upcomingCards = new UpcomingCards();
		this._gameLogic = new GameLogic(this._table, this._upcomingCards);
		this.addHumanPlayer(firstPlayerName, true, firstPlayerSocket);
		console.log("Game with code " + gameCode + " created.");
	}

	get Open() {return this._open;}

	subscribeToPlayerEvents(player)
	{
		if (player instanceof HumanPlayer)
		{
			// PLAYER TO GAME - WAIT PAGE EVENTS
			player.on("playerAddAIFromWaitPage", this.onPlayerAddAIFromWaitPage.bind(this));
			player.on("playerEndGameFromWaitPage", this.onPlayerEndGameFromWaitPage.bind(this));
			player.on("playerStartGameWithCurrentPlayers", this.onPlayerStartGameWithCurrentPlayers.bind(this));

			// PLAYER TO GAME - GAME EVENTS - game events that only human players will emit
			player.on("playerQuitGame", this.onPlayerQuitGame.bind(this));
		}

		// PLAYER TO GAME - GAME EVENTS - game events that any players will emit
		player.on("playerPlayCard", this.onPlayerPlayCard.bind(this));
		player.on("playerRowToTake", this.onPlayerRowToTake.bind(this));
	}

	updateOpen()
	{
		if (this._state != GameStates.WaitForPlayers)
		{
			this._open = false;
			return;
		}

		if (this._players.size >= 10)
			this._open = false;
		else
			this._open = true;
	}

	nameAvailable(name)
	{
		return !this._players.has(name);
	}

	gameHasHumanPlayersLeft()
	{
		return Array.from(this._players).some( (name_player) => {
			return name_player[1] instanceof HumanPlayer
		 });
	}

	everyPlayerInState(state)
	{
		let bEveryPlayerInState = true;
		this._players.forEach( (player) => {
			bEveryPlayerInState = bEveryPlayerInState && player.State == state;
		});
		return bEveryPlayerInState;
	}

	addHumanPlayer(name, bStartedGame, socket)
	{
		let player = new HumanPlayer(name, bStartedGame, socket);
		player.State = PlayerStates.WaitPage;
		this._players.set(name, player);
		this.subscribeToPlayerEvents(player);
		this.updateOpen();
		this.updateAllPlayersAndSpectatorsWithPlayerList();
		console.log(`Human player ${name} has been added to game ${this._gameCode}`);
	}

	// returns AI name
	addArtificialPlayer()
	{
		let n = 1;
		let name;
		do{
			name = "AI"+n;
			n++;
		} while (this._players.has(name));

		let player = new ArtificialPlayer(name);
		player.State = PlayerStates.WaitPage;
		this._players.set(name, player);
		this.subscribeToPlayerEvents(player);
		this.updateOpen();
		this.updateAllPlayersAndSpectatorsWithPlayerList();
		console.log(`Artificial player ${name} has been added to game ${this._gameCode}`);
		return name;
	}

	addSpectator(socket)
	{
		let spectator = new Spectator(socket);
		this._spectators.push(spectator);

		spectator.updatePlayerList(Array.from(this._players.keys()));
		console.log(`Spectator has been added to game ${this._gameCode}`);
	}

	removePlayer(name)
	{
		if (!this._players.delete(name))
			return;
		this.updateAllPlayersAndSpectatorsWithPlayerList();
		this.updateOpen();
		console.log(name + " removed from game " + this._gameCode);
	}

	initializePlayerHands()
	{
		this._players.forEach(function (player) {
			player.Hand = this._deck.takeCards(10);
		}.bind(this));
	}

	initializeTableCards()
	{
		this._table.setInitialFourCards(Array.from(this._deck.takeCards(4)));
	}

	endGame(playerWhoEndedTheGame)
	{
		this.tellAllPlayersAndSpectatorsThatTheGameGotTerminated(playerWhoEndedTheGame.Name);

		// tell the gameManager to remove this game
		this.emit("gameEnded", this._gameCode);
	}

	// bStartOfRound = true means the round is starting rather than resuming after a player chose a row to take
	// false means it is starting after a player chose which row to take
	// rowToTake is only passed in if !bStartOfRound
	startOrResumeRound(bStartOfRound, rowToTake)
	{
		this._state = GameStates.RoundAnimationInProgress;
		this._players.forEach((player) => {player.State = PlayerStates.RoundAnimationInProgress});
		let details = this._gameLogic.doAsMuchOfRoundAsPossible(bStartOfRound, rowToTake);
		if (details.needToAskThisPlayerForARowToTake)
		{
			// the round did not complete. A certain player needs to choose a card
			let playerWhoNeedsToChooseARowToTake = this._players.get(details.needToAskThisPlayerForARowToTake);
			if (!playerWhoNeedsToChooseARowToTake)
				throw "Somehow, a player not in the player map needs to choose a row to take ";
			playerWhoNeedsToChooseARowToTake.State = PlayerStates.RoundAnimationInProgress_ExpectedToSendRowToTake;
		}
		// wait a few moments before sending out the following round steps
		let timeToWait = bStartOfRound ? 1000 : 100;
		setTimeout(function() {this.updateAllPlayersAndSpectatorsWithRoundStepSequence(details.roundStepSequence);}.bind(this), timeToWait);
	}

	// GENERAL GAME UPDATES FOR PLAYERS AND SPECTATORS

	updateAllPlayersAndSpectatorsWithPlayerList()
	{
		let playerList = Array.from(this._players.keys());

		this._players.forEach(function (player){
			player.updatePlayerList(playerList);
		});

		this._spectators.forEach(function (spectator){
			spectator.updatePlayerList(playerList);
		});
	}

	tellAllPlayersAndSpectatorsThatTheGameGotTerminated(nameOfPlayerWhoEndedTheGame)
	{
		this._players.forEach(function (player){
			if (player.Name != nameOfPlayerWhoEndedTheGame)
				player.terminateGame(nameOfPlayerWhoEndedTheGame);
		});

		this._spectators.forEach(function (spectator){
			spectator.terminateGame(nameOfPlayerWhoEndedTheGame);
		});
	}

	tellAllPlayersAndSpectatorsGameStarted()
	{
		let listOfPlayers = Array.from(this._players.keys());
		let table = this._table.Table;

		this._players.forEach(function (player){
			player.startGame(listOfPlayers, table);
		});

		this._spectators.forEach(function (player){
			player.startGame(listOfPlayers, table);
		});
	}

	updateAllPlayersAndSpectatorsWithUpcomingCards()
	{
		let upcomingCards = this._upcomingCards.Cards;
		this._players.forEach(function (player){
			player.updateUpcomingCards(upcomingCards);
		});

		this._spectators.forEach(function (spectator){
			spectator.updateUpcomingCards(upcomingCards);
		});
	}

	updateAllPlayersAndSpectatorsWithRoundStepSequence(roundStepSequence)
	{
		this._players.forEach(function (player){
			player.animate(roundStepSequence);
		});

		this._spectators.forEach(function (spectator){
			spectator.animate(roundStepSequence);
		});
	}

	// PLAYER TO GAME - WAIT PAGE EVENT HANDLERS

	onPlayerEndGameFromWaitPage(player)
	{
		if (this._state != GameStates.WaitForPlayers)
		{
			console.log("playerEndGameFromWaitPage message received at unexpected time. Ignored.");
			return;
		}
		this.endGame(player);
	}

	onPlayerAddAIFromWaitPage(player)
	{
		if (this._state != GameStates.WaitForPlayers)
		{
			console.log("playerAddAIFromWaitPage message received at unexpected time. Ignored.");
			return;
		}
		this.addArtificialPlayer();
	}

	onPlayerStartGameWithCurrentPlayers(player)
	{
		if (this._state == GameStates.WaitForPlayers &&
			this._players.size >= 2 && this._players.size <= 10)
		{
			this._open = false;
			this._state = GameStates.WaitForAllPlayersToChooseTheirCard;
			this.initializePlayerHands();
			this.initializeTableCards();
			this.tellAllPlayersAndSpectatorsGameStarted();
			this._players.forEach((player) => {player.State = PlayerStates.ChooseCard});
		}
		else
		{
			console.log("playerStartGameWithCurrentPlayers message received at unexpected time. Ignored.");
			return;
		}
	}

	// PLAYER TO GAME - GAME EVENT HANDLERS

	onPlayerQuitGame(player)
	{
		if (this._state == GameStates.WaitForPlayers)
		{
			this.removePlayer(player.Name);
			if (player.StartedGame)
				this.endGame(player);
		}
		// WIP TODO if in the middle of game, replace with an AI. if there are no human players left, end game.
	}

	onPlayerPlayCard(data)
	{
		if (this._state != GameStates.WaitForAllPlayersToChooseTheirCard)
		{
			console.log("clientPlayCard was received at an unexpected time or sent a card that the player does not have. Ignored.");
			return;
		}
		this._upcomingCards.playCard(data.playedCard, data.player.Name);
		data.player.State = PlayerStates.WaitForRestToPlayTheirCard;
		console.log(`Player ${data.player.Name} in game ${this._gameCode} has played card ${data.playedCard}`);
		this.updateAllPlayersAndSpectatorsWithUpcomingCards();

		// if every player has played their card
		if (this._upcomingCards.Size == this._players.size && 
			this.everyPlayerInState(PlayerStates.WaitForRestToPlayTheirCard))
		{
			console.log(`Every player in game ${this._gameCode} has played their card`);
			this.startOrResumeRound(true);
		}
	}

	onPlayerRowToTake(data)
	{
		console.log("A player has chosen which row to take.");
		data.player.State = PlayerStates.RoundAnimationInProgress;
		this.startOrResumeRound(false, data.rowToTakeIndex);
	}
}