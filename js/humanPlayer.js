'use strict';

let Player = require('./player.js');

module.exports = class HumanPlayer extends Player
{
	constructor(name, socket)
	{
		super(name);
		this._socket = socket;
	}
}