'use strict';

const EventEmitter = require('events');
const Player = require('./playerStates.js');

module.exports = class Player extends EventEmitter
{
	constructor(name, bStartedGame)
	{
		super();
		this._name = name;
		this._bStartedGame = bStartedGame;
	}

	get Name() {return this._name;}
	get StartedGame() {return this._bStartedGame};
}