"use strict";

class Scoreboard
{
	constructor(players)
	{
		this._scoreboardContainer = $("#scoreboard");
		this._scores = players.map(playerName => {return {name: playerName, score: 0}});
	}
	
	draw()
	{
		this._scoreboardContainer.empty();
		
		for (let i = 0; i < numberOfPlayers; i++)
		{
			let e = $(document.createElement("div"));
			e.addClass("scoreboardElement");
			e.css("width", lc.scoreboardElementWidth + "px");
			e.css("height", lc.scoreboardElementHeight + "px");
			this._scoreboardContainer.append(e);
		}
	}
	
	resize()
	{
		this._scoreboardContainer.css("width", lc.scoreboardWidth + "px" );
		this._scoreboardContainer.css("height", lc.scoreboardHeight + "px" );
	}
	
}
