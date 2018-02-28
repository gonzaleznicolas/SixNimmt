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
	
	resize()
	{
		$("#scoreboard").css("width", lc.scoreboardWidth + "px" );
		$("#scoreboard").css("height", lc.scoreboardHeight + "px" );
	}
	
}
