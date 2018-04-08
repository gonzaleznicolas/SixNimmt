'use strict';

const Player = require('./player.js');

module.exports = class ArtificialPlayer extends Player
{
	constructor(name)
	{
		super(name, false);
	}

	// UPDATES FROM THE GAME

	// updates that only human players care about
	updatePlayerList(playerList){}
	terminateGame(nameOfPlayerWhoEndedTheGame){}

	startGame(playerList)
	{

	}
}