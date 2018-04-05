'use strict';

let Player = require('./player.js');

module.exports = class ArtificialPlayer extends Player
{
	constructor(name)
	{
		super(name);
	}
}