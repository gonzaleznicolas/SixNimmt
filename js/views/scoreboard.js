"use strict";

class Scoreboard
{
	constructor(players)
	{
		this._scores = players.map(playerName => {return {name: playerName, score: 0}});
	}
	
	draw()
	{

	}
	
	resize(scoreboardWidth, scoreboardHeight)
	{
		$("#scoreboard").css("width", scoreboardWidth + "px" );
		$("#scoreboard").css("height", scoreboardHeight + "px" );
	}
	
}
