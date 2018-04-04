'use strict';

let Game = require('./Game.js');

module.exports = class GameManager
{
	constructor()
	{
		this._games = new Map();
	}
}