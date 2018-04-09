'use strict';

const ArtificialPlayer = require('./participants/artificialPlayer.js');
const HumanPlayer = require('./participants/humanPlayer.js');
const Spectator = require('./participants/spectator.js');
const EventEmitter = require('events');
const GameStates = require('./gameStates.js');
const PlayerStates = require('./participants/playerStates.js');
const Deck = require('./deck.js');
const Table = require('./table.js');

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
		this.addHumanPlayer(firstPlayerName, true, firstPlayerSocket);
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

			// PLAYER TO GAME - GAME EVENTS
			player.on("playerQuitGame", this.onPlayerQuitGame.bind(this));
		}
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

	addHumanPlayer(name, bStartedGame, socket)
	{
		let player = new HumanPlayer(name, bStartedGame, socket);
		this._players.set(name, player);
		this.subscribeToPlayerEvents(player);
		this.updateOpen();
		this.updateAllPlayersAndSpectatorsWithPlayerList();
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
		this._players.set(name, player);
		this.subscribeToPlayerEvents(player);
		this.updateOpen();
		this.updateAllPlayersAndSpectatorsWithPlayerList();
		return name;
	}

	addSpectator(socket)
	{
		let spectator = new Spectator(socket);
		this._spectators.push(spectator);

		spectator.updatePlayerList(Array.from(this._players.keys()));
	}

	removePlayer(name)
	{
		if (!this._players.delete(name))
			return;
		this.updateAllPlayersAndSpectatorsWithPlayerList();
		this.updateOpen();
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

	tellAllPlayersGameStarted()
	{
		let listOfPlayers = Array.from(this._players.keys());
		let table = this._table.Table;
		this._players.forEach(function (player){
			player.startGame(listOfPlayers, table);
		}.bind(this));
	}

	tellAllSpectatorsGameStarted()
	{
		let listOfPlayers = Array.from(this._players.keys());
		let table = this._table.Table;
		this._spectators.forEach(function (player){
			player.startGame(listOfPlayers, table);
		}.bind(this));
	}

	// PLAYER TO GAME - WAIT PAGE EVENT HANDLERS

	onPlayerEndGameFromWaitPage(player)
	{
		if (this._state != GameStates.WaitForPlayers || !player.StartedGame || player.State != PlayerStates.WaitPage)
		{
			console.log("playerEndGameFromWaitPage message received at unexpected time. Ignored.");
			return;
		}
		this.endGame(player);
	}

	onPlayerAddAIFromWaitPage(player)
	{
		if (this._state != GameStates.WaitForPlayers || !player.StartedGame || player.State != PlayerStates.WaitPage)
		{
			console.log("playerAddAIFromWaitPage message received at unexpected time. Ignored.");
			return;
		}
		this.addArtificialPlayer();
	}

	onPlayerStartGameWithCurrentPlayers(player)
	{
		if (this._state == GameStates.WaitForPlayers &&
			player.StartedGame &&
			player.State == PlayerStates.WaitPage &&
			this._players.size >= 2 && this._players.size <= 10)
		{
			this._open = false;
			this._state == GameStates.WaitForAllPlayersToChooseTheirCard;
			this.initializePlayerHands();
			this.initializeTableCards();
			this._players.forEach((player) => {player.State = PlayerStates.ChooseCard});
			this.tellAllPlayersGameStarted();
			this.tellAllSpectatorsGameStarted();
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
		// if in the middle of game, replace with an AI. if there are no human players left, end game.
	}
}