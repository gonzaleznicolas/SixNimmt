'use strict';

const ArtificialPlayer = require('./artificialPlayer.js');
const HumanPlayer = require('./humanPlayer.js');
const EventEmitter = require('events');
const GameStates = require('./gameStates.js');
const Spectator = require('./spectator.js');

module.exports = class Game extends EventEmitter
{
	constructor(gameCode, firstPlayerName, firstPlayerSocket)
	{
		super();
		this._gameState = GameStates.WaitForPlayers;
		this._gameCode = gameCode;
		this._players = new Map();
		this._open = true;
		this._spectators = [];
		this.addHumanPlayer(firstPlayerName, true, firstPlayerSocket);
	}

	get Open() {return this._open;}

	subscribeToPlayerEvents(player)
	{
		if (player instanceof HumanPlayer)
		{
			player.on("playerAddAIFromWaitPage", this.onPlayerAddAIFromWaitPage.bind(this));
			player.on("playerQuitGame", this.onPlayerQuitGame.bind(this));
			player.on("playerEndGameFromWaitPage", this.onPlayerEndGameFromWaitPage.bind(this));
			player.on("playerStartGameWithCurrentPlayers", this.onPlayerStartGameWithCurrentPlayers.bind(this));
		}
	}

	updateOpen()
	{
		if (this._gameState != GameStates.WaitForPlayers)
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
		if (!this._players.has(name))
			return;
		let player = this._players.get(name);
		this._players.delete(name);
		this.updateAllPlayersAndSpectatorsWithPlayerList();
		this.updateOpen();
	}

	endGame(playerWhoEndedTheGame)
	{
		this.tellAllPlayersAndSpectatorsThatTheGameGotTerminated(playerWhoEndedTheGame.Name);

		// tell the gameManager to remove this game
		this.emit("gameEnded", this._gameCode);
	}

	updateAllPlayersAndSpectatorsWithPlayerList()
	{
		let playerList = Array.from(this._players.keys());

		this._players.forEach(function (player){
			player.updatePlayerList(playerList);
		}.bind(this));

		this._spectators.forEach(function (spectator){
			spectator.updatePlayerList(playerList);
		}.bind(this));
	}

	tellAllPlayersAndSpectatorsThatTheGameGotTerminated(nameOfPlayerWhoEndedTheGame)
	{
		this._players.forEach(function (player){
			if (player.Name != nameOfPlayerWhoEndedTheGame)
				player.terminateGame(nameOfPlayerWhoEndedTheGame);
		}.bind(this));

		this._spectators.forEach(function (spectator){
			spectator.terminateGame(nameOfPlayerWhoEndedTheGame);
		}.bind(this));
	}

	onPlayerEndGameFromWaitPage(player)
	{
		if (this._gameState == GameStates.WaitForPlayers && player.StartedGame)
			this.endGame(player);
	}

	onPlayerAddAIFromWaitPage(player)
	{
		if (this._gameState == GameStates.WaitForPlayers && player.StartedGame)
			this.addArtificialPlayer();
	}

	onPlayerQuitGame(player)
	{
		if (this._gameState == GameStates.WaitForPlayers)
		{
			this.removePlayer(player.Name);
			if (player.StartedGame)
				this.endGame(player);
		}
		// if in the middle of game, replace with an AI. if there are no human players left, end game.
	}

	onPlayerStartGameWithCurrentPlayers(playerStartingGame)
	{
		// if (this._gameState == GameStates.WaitForPlayers &&
		// 	playerStartingGame.StartedGame &&
		// 	this._players.size >= 2 && this._players.size <= 10)
		// {
		// 	this._open = false;

		// 	this._players.forEach(function (player){
		// 		player.startGame(Array.from(this._players.keys()));
		// 	}.bind(this));
		// }
	}
}