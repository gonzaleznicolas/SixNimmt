'use strict';

const Player = require('./player.js');
const PlayerStates = require('./playerStates.js');

module.exports = class HumanPlayer extends Player
{
	constructor(name, bStartedGame, socket)
	{
		super(name, bStartedGame);
		this._socket = socket;
		
		// CLIENT TO SERVER - WAIT PAGE EVENTS
		this._socket.on("clientAddAIFromWaitPage", this.onClientAddAIFromWaitPage.bind(this));
		this._socket.on("clientEndGameFromWaitPage", this.onClientEndGameFromWaitPage.bind(this));
		this._socket.on("clientStartGameWithCurrentPlayers", this.onClientStartGameWithCurrentPlayers.bind(this));

		// CLIENT TO SERVER - GAME EVENTS
		this._socket.on("clientQuitGame", this.onClientQuitGame.bind(this));
		this._socket.on("disconnect", this.onClientQuitGame.bind(this));
		this._socket.on("clientPlayCard", this.onClientPlayCard.bind(this));
	}

	get Socket() {return this._socket;}

	// METHODS CALLED FROM WITHIN THE HumanPlayer

	updateHand()
	{
		this._socket.emit("serverUpdatedHand", Array.from(this._hand));
	}
	
	// METHODS CALLED BY THE GAME. METHODS ANY PLAYER MUST IMPLEMENT

	updatePlayerList(playerList)
	{
		this._socket.emit('serverPlayerList', playerList);
	}

	terminateGame(nameOfPlayerWhoEndedTheGame)
	{
		this._socket.emit("serverGameTerminated", nameOfPlayerWhoEndedTheGame);
	}

	startGame(playerList, table)
	{
		this._socket.emit("serverStartGame", {
			playerList: playerList,
			table: table,
			isSpectator: false,
			hand: Array.from(this._hand)
		});
	}

	updateUpcomingCards(upcomingCards)
	{
		this._socket.emit("serverUpcomingCards", upcomingCards);
	}

	animate(animationSequence)
	{
		this._socket.emit("serverAnimate", animationSequence);
	}

	// CLIENT TO SERVER - WAIT PAGE EVENT HANDLERS

	onClientEndGameFromWaitPage()
	{
		if (!this._bStartedGame || this._state != PlayerStates.WaitPage)
		{
			console.log("clientEndGameFromWaitPage received at unexpected time. Ignored.");
			return;
		}
		this.emit('playerEndGameFromWaitPage', this);
	}

	onClientAddAIFromWaitPage()
	{
		if (!this._bStartedGame || this._state != PlayerStates.WaitPage)
		{
			console.log("clientAddAIFromWaitPage received at unexpected time. Ignored.");
			return;
		}
		this.emit('playerAddAIFromWaitPage', this);
	}

	onClientStartGameWithCurrentPlayers()
	{
		if (!this._bStartedGame || this._state != PlayerStates.WaitPage)
		{
			console.log("clientStartGameWithCurrentPlayers received at unexpected time. Ignored.");
			return;
		}
		this.emit("playerStartGameWithCurrentPlayers", this);
	}

	// CLIENT TO SERVER - GAME EVENT HANDLERS

	onClientQuitGame()
	{
		this.emit('playerQuitGame', this);
	}

	onClientPlayCard(playedCard)
	{
		if (this._state != PlayerStates.ChooseCard || !this._hand.has(playedCard))
		{
			console.log("clientPlayCard was received at an unexpected time or sent a card that the player does not have. Ignored.");
			return;
		}
		this._hand.delete(playedCard);
		this.emit('playerPlayCard', {player: this, playedCard: playedCard});
		this.updateHand();
	}
}