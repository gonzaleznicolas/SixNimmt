'use strict';

module.exports = class Player
{
	constructor(name, socket)
	{
		this._name = name;
		this._socket = socket;
	}
}