'use strict';

const Player = require('./participants/player.js');
const ArtificialPlayer = require('./participants/artificialPlayer.js');
const HumanPlayer = require('./participants/humanPlayer.js');
const Spectator = require('./participants/spectator.js');
const EventEmitter = require('events');
const GameStates = require('./gameGlobals.js').GameStates;
const PlayerStates = require('./gameGlobals.js').PlayerStates;
const SpectatorStates = require('./gameGlobals.js').SpectatorStates;
const Deck = require('./deck.js');
const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');
const RoundProcessor = require('./roundProcessor.js');
const Scoreboard = require('./scoreboard.js');

/*************************************************************
 * A turn is one card being moved to its spot on the table
 * A round is from the time players are asked to choose a card, to when all the played cards
 * are arranged on the table.
 * An iteration is from the time we give a player 10 cards until every player has played their 10 cards
 *************************************************************/

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
		this._scoreboard = new Scoreboard();
		this._roundProcessor = new RoundProcessor(this._table, this._upcomingCards, this._scoreboard);
		console.log("Game with code " + gameCode + " created.");
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

			// PLAYER TO GAME - GAME EVENTS - game events that only human players will emit
			player.on("playerQuitGame", this.onPlayerQuitGame.bind(this));
		}

		// PLAYER TO GAME - GAME EVENTS - game events that any players will emit
		player.on("playerPlayCard", this.onPlayerPlayCard.bind(this));
		player.on("playerRowToTake", this.onPlayerRowToTake.bind(this));
		player.on('playerOrSpectatorDoneDisplayingRound', this.onPlayerOrSpectatorDoneDisplayingRound.bind(this));
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
		console.log('Testing if there are human players left in game '+this._gameCode);
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

	listOfPlayerNamesNotInState(state)
	{
		let list = [];
		this._players.forEach( (player) => {
			if (player.State != state)
				list.push(player.Name);
		});
		return list;
	}

	listOfSpectatorSocketIDsNotInState(state)
	{
		let list = [];
		this._spectators.forEach( (spectator) => {
			if (spectator.State != state)
				list.push(spectator.Socket.id);
		});
		return list;
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
		spectator.State = SpectatorStates.RoundAnimationNotInProgress;
		this._spectators.push(spectator);

		spectator.on('spectatorQuitGame', this.onSpectatorQuitGame.bind(this));
		spectator.on('playerOrSpectatorDoneDisplayingRound', this.onPlayerOrSpectatorDoneDisplayingRound.bind(this));

		spectator.updatePlayerList(Array.from(this._players.keys()));
		console.log(`Spectator has been added to game ${this._gameCode}`);
	}

	removeSpectator(spectator)
	{
		if (!this._spectators)
		{
			console.log('Was going to delete a spectator but the _spectator array has already been deleted.');
			return;
		}
		let index = this._spectators.findIndex( (s) => {return s.Socket.id = spectator.Socket.id});
		if (index >= 0)
		{
			this._spectators.splice(index, 1);
		}
	}

	removePlayer(name)
	{
		if (!this._players.delete(name))
			return;
		this.updateAllPlayersAndSpectatorsWithPlayerList();
		this.updateOpen();
		console.log(name + " removed from game " + this._gameCode);
	}

	replaceHumanPlayerWithArtificialPlayer(humanPlayerToReplace)
	{
		if (!this._players.delete(humanPlayerToReplace.Name))
		{
			console.log('Player ' + humanPlayerToReplace.Name +' who \'quit\' was not in the game. Ignored.')
			return;
		}

		let nameForArtificialReplacement = "AI "+humanPlayerToReplace.Name;
		nameForArtificialReplacement = nameForArtificialReplacement.trim(0, 6); // names can be max 6 chars long
		
		// make sure the name is not taken
		let n = 1;
		while (this._players.has(nameForArtificialReplacement))
		{
			nameForArtificialReplacement = "AI "+n+humanPlayerToReplace.Name;
			nameForArtificialReplacement = nameForArtificialReplacement.trim(0, 6); // names can be max 6 chars long
		}

		let artificialPlayerReplacement = new ArtificialPlayer(nameForArtificialReplacement);
		artificialPlayerReplacement.Hand = humanPlayerToReplace.Hand;
		this._players.set(nameForArtificialReplacement, artificialPlayerReplacement);
		this.subscribeToPlayerEvents(artificialPlayerReplacement);
		this._scoreboard.renamePlayer(humanPlayerToReplace.Name, artificialPlayerReplacement.Name);

		console.log(`Human player ${humanPlayerToReplace.Name} has left and has been replaced by artificial player ${artificialPlayerReplacement.Name}`);

		if (this._state == GameStates.WaitForAllPlayersToChooseTheirCard)
		{
			if (this._upcomingCards.playerHasPlayedACard(humanPlayerToReplace.Name)) // the human player picked a card for this round already
			{
				console.log(`${humanPlayerToReplace.Name} had played a card before disconnecting so ${artificialPlayerReplacement.Name} did not play a card`);
				this._upcomingCards.renamePlayer(humanPlayerToReplace.Name, artificialPlayerReplacement.Name);
				artificialPlayerReplacement.State = PlayerStates.WaitForRestToPlayTheirCard;
			}
			else //upcoming cards doesnt have a card for player
			{
				// changing the state will make the artificial player choose a card within a few seconds
				console.log(`${humanPlayerToReplace.Name} had not played a card before disconnecting so ${artificialPlayerReplacement.Name} was instructed to pick a card`);
				artificialPlayerReplacement.State = PlayerStates.ChooseCard;
			}
		}
		else if (this._state == GameStates.RoundAnimationInProgress)
		{
			if (humanPlayerToReplace.State == PlayerStates.RoundAnimationInProgress_ExpectedToSendRowToTake)
			{
				console.log(`${humanPlayerToReplace.Name} was supposed to pick a row to take but quit, so ${artificialPlayerReplacement.Name} will pick a row`);
				artificialPlayerReplacement.chooseARowToTake();
			}
			else
			{
				console.log(`${humanPlayerToReplace.Name} was in the middle of displaying an animation when they quit, so ${artificialPlayerReplacement.Name} will just emit playerOrSpectatorDoneDisplayingRound`);
				artificialPlayerReplacement.sayDoneDisplayingRound();
			}
		}
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
		// if playerWhoEndedTheGame is not passed in, dont notify everyone that the game was ended.
		// no parameter wil be passed in when there is no need to notify anyone. e.g. when there are no
		// human players or spectators left
		if (playerWhoEndedTheGame)
			this.tellAllPlayersAndSpectatorsThatTheGameGotTerminated(playerWhoEndedTheGame.Name);

		this._players.forEach( function (p) {
			p.removeDisconnectListener();
		});
		this._players.clear();

		this._spectators.forEach( function (s) {
			s.removeDisconnectListener();
		});
		this._spectators.clear();
		
		delete this._deck;
		delete this._upcomingCards;
		delete this._scoreboard;
		delete this._players;
		delete this._spectators;
		delete this._table;
		delete this._roundProcessor;
		delete this._state;
		delete this._roundNumberOfCurrentIteration;

		// tell the gameManager to remove this game
		this.emit("gameEnded", this._gameCode);
	}

	startGame()
	{
		this._open = false;
		this._scoreboard.initScoreboardWithThesePlayers(Array.from(this._players.keys()));
		this._state = GameStates.WaitForAllPlayersToChooseTheirCard;
		this.initializePlayerHands();
		this.initializeTableCards();
		this._players.forEach((p) => {p.State = PlayerStates.ChooseCard});
		this._spectators.forEach( (s) => {s.State = SpectatorStates.RoundAnimationNotInProgress});
		this._roundNumberOfCurrentIteration = 1;
		this.tellAllPlayersAndSpectatorsGameStarted();
	}

	startANewIteration()
	{
		console.log("new iteration started");
		this._table.reset();
		this._deck.reset();
		this.initializePlayerHands();
		this.initializeTableCards();
		this._roundNumberOfCurrentIteration = 1;
	}

	startANewRound()
	{
		if (this._scoreboard.anyPlayerHasReached66Pts())
		{
			console.log("someone won");
			console.log(this._scoreboard.lowestScores());
		}
		this._roundNumberOfCurrentIteration++;
		if (this._roundNumberOfCurrentIteration > 10)
		{
			this.startANewIteration();
		}
		this._upcomingCards.reset();
		this._players.forEach((player) => {player.State = PlayerStates.ChooseCard});
		this._spectators.forEach((spectator) => {spectator.State = SpectatorStates.RoundAnimationNotInProgress});
		this._state = GameStates.WaitForAllPlayersToChooseTheirCard;
		this.tellAllPlayersAndSpectatorsTheNextRoundIsStartingAndSendDetails();
	}

	// bStartOfRound = true means the round is starting rather than resuming after a player chose a row to take
	// false means it is starting after a player chose which row to take
	// rowToTake and nameOfPlayerWhoTookRow are only passed in if !bStartOfRound
	startOrResumeDisplayingRound(bStartOfRound, rowToTake, nameOfPlayerWhoTookRow)
	{
		this._state = GameStates.RoundAnimationInProgress;
		this._players.forEach((player) => {player.State = PlayerStates.RoundAnimationInProgress});
		this._spectators.forEach((spectator) => {spectator.State = SpectatorStates.RoundAnimationInProgress});
		let details = this._roundProcessor.doAsMuchOfRoundAsPossible(bStartOfRound, rowToTake, nameOfPlayerWhoTookRow);
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

	tellAllPlayersAndSpectatorsTheNextRoundIsStartingAndSendDetails()
	{
		let table = this._table.Table;
		let scoreboard = this._scoreboard.Scores;

		this._players.forEach(function (player){
			player.startRound(table, scoreboard);
		});

		this._spectators.forEach(function (player){
			player.startRound(table, scoreboard);
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
			player.roundInfo(roundStepSequence);
		});

		this._spectators.forEach(function (spectator){
			spectator.roundInfo(roundStepSequence);
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
			this.startGame();
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
		else if (this._state == GameStates.WaitForAllPlayersToChooseTheirCard ||
				this._state == GameStates.RoundAnimationInProgress)
		{
			this.replaceHumanPlayerWithArtificialPlayer(player);
		}
		if (!this.gameHasHumanPlayersLeft() && this._spectators.length == 0)
		{
			console.log('there are no human players or spectators left');
			this.endGame(player);
		}
		else
			console.log('there are human players or spectators left');
	}

	onSpectatorQuitGame(spectator)
	{
		this.removeSpectator(spectator);
		if (this._state == GameStates.RoundAnimationInProgress)
		{
			// this is important because what if everyone is done displaying the round, only one spectator is still
			// displaying. Within this window, the spectator quits. Then the next round would never start because we 
			// would be left waiting for every player and spectator to finish displaying the round.
			// So, if a spectator quits, and the game is in state RoundAnimationInProgress, call onPlayerOrSpectatorDoneDisplayingRound().
			// No need to pass in the parameter. We just want that funciton to check if all the remaining players and spectators
			// have finished.
			this.onPlayerOrSpectatorDoneDisplayingRound();
			console.log("A spectator has quit while game in state RoundAnimationInProgress");
		}
		if (!this.gameHasHumanPlayersLeft() && this._spectators.length == 0)
		{
			console.log('there are no human players or spectators left');
			this.endGame(spectator);
		}
		else
			console.log('there are human players or spectators left');
	}

	onPlayerPlayCard(data)
	{
		if (!this._players)
		{
			console.log('A player tried to play a card but this game was already deleted. Ignore.');
			return;
		}
		if (this._state != GameStates.WaitForAllPlayersToChooseTheirCard)
		{
			console.log("playerPlayCard was received at an unexpected time or sent a card that the player does not have. Ignored.");
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
			this.startOrResumeDisplayingRound(true);
		}
	}

	onPlayerRowToTake(data)
	{
		if (!this._players)
		{
			console.log('A player tried to choose a row to take but this game was already deleted. Ignore.');
			return;
		}
		console.log( data.player.Name + " has chosen which row to take.");
		data.player.State = PlayerStates.RoundAnimationInProgress;
		this.startOrResumeDisplayingRound(false, data.rowToTakeIndex, data.player.Name);
	}

	// PLAYER OR SPECTATOR TO GAME - GAME EVENT HANDLERS

	onPlayerOrSpectatorDoneDisplayingRound(participant)
	{
		if (!this._players)
		{
			console.log('A participant tried to say they are done displaying round, but the game was already deleted. Ignore.');
			return;
		}
		if (this._state != GameStates.RoundAnimationInProgress)
		{
			console.log("playerOrSpectatorDoneDisplayingRound was received at an unexpected time. Ignored.");
			return;
		}

		console.log("Game notified that a participant is done displaying round");

		if (participant instanceof Player)
		{
			participant.State = PlayerStates.DoneDisplayingRoundAnimation;
		}
		else if (participant instanceof Spectator)
		{
			participant.State = SpectatorStates.DoneDisplayingRoundAnimation;
		}

		if (this.everyPlayerInState(PlayerStates.DoneDisplayingRoundAnimation) && 
			this._spectators.every( (s) => s.State == SpectatorStates.DoneDisplayingRoundAnimation))
		{
			console.log("Every participant is done displaying the round.");
			this.startANewRound();
		}
		else
		{
			console.log("The players not done displaying the animation are:");
			console.log(this.listOfPlayerNamesNotInState(PlayerStates.DoneDisplayingRoundAnimation));

			console.log("The spectators not done displaying the animation are:");
			console.log(this.listOfSpectatorSocketIDsNotInState(SpectatorStates.DoneDisplayingRoundAnimation));
		}
	}
}