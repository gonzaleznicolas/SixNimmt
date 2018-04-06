'use strict';

const EventEmitter = require('events');

module.exports = class Player extends EventEmitter
{
	constructor(name)
	{
		super();
		this._name = name;
	}
}