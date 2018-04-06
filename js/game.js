'use strict';

const ArtificialPlayer = require('./artificialPlayer.js');
const HumanPlayer = require('./humanPlayer.js');
const EventEmitter = require('events');
const GameStates = require('./gameStates.js');

module.exports = class Game extends EventEmitter
{
	constructor(gameCode, firstPlayerName, firstPlayerSocket, io)
	{
		super();
		this._io = io;
		this._gameState = GameStates.WaitForPlayers;
		this._gameCode = gameCode;
		this._roomName = "room_" + this._gameCode;
		this._players = new Map();
		this.addHumanPlayer(firstPlayerName, true, firstPlayerSocket);
		this._open = true;
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
		socket.join(this._roomName);
		this._io.sockets.in(this._roomName).emit('serverPlayerList', Array.from(this._players.keys()));
		this.updateOpen();
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
		this._io.sockets.in(this._roomName).emit('serverPlayerList', Array.from(this._players.keys()));
		this.updateOpen();
		return name;
	}

	addSpectator(socket)
	{
		socket.join(this._roomName);
		this._io.sockets.in(this._roomName).emit('serverPlayerList', Array.from(this._players.keys()));
	}

	removePlayer(name)
	{
		if (!this._players.has(name))
			return;
		let player = this._players.get(name);
		let bPlayerStartedGame = player.StartedGame;
		if (player instanceof HumanPlayer)
			player.leaveRoom(this._roomName);
		this._players.delete(name);
		this._io.sockets.in(this._roomName).emit('serverPlayerList', Array.from(this._players.keys()));
		this.updateOpen();
		if ((bPlayerStartedGame && this._gameState == GameStates.WaitForPlayers) || !this.gameHasHumanPlayersLeft())
		{
			this.endGame(player);
		}
	}

	endGame(playerWhoEndedTheGame)
	{
		playerWhoEndedTheGame.Socket.broadcast.to(this._roomName).emit("serverGameTerminated", playerWhoEndedTheGame.Name);
		this.emit("gameEnded", this._gameCode);
	}

	onPlayerEndGameFromWaitPage(player)
	{
		if (this._gameState == GameStates.WaitForPlayers)
			this.endGame(player);
	}

	onPlayerAddAIFromWaitPage(player)
	{
		if (this._gameState == GameStates.WaitForPlayers)
			this.addArtificialPlayer();
	}

	onPlayerQuitGame(player)
	{
		if (this._gameState == GameStates.WaitForPlayers)
			this.removePlayer(player.Name);
	}

	onPlayerStartGameWithCurrentPlayers(playerStartingGame)
	{
		if (this._gameState == GameStates.WaitForPlayers &&
			playerStartingGame.StartedGame &&
			this._players.size >= 2 && this._players.size <= 10)
		{
			this._open = false;
			this._io.sockets.in(this._roomName).emit('serverStartGame', Array.from(this._players.keys()));
		}
	}
}