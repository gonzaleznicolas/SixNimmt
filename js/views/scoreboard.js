"use strict";

class Scoreboard
{
	constructor(players)
	{
		this._scoreboardContainer = $("#scoreboard");

		// make a ScoreboardElement object for each player
		this._scoreboardElements = players.map(playerName => {return new ScoreboardElement(playerName)});

		// put all the ScoreboardElements in the scoreboardContainer
		this._scoreboardElements.forEach(element => this._scoreboardContainer.append(element._div));
	}

	incrementScore(playerName, incrementBy)
	{
		console.log(hi);
	}
	
	resize()
	{
		this._scoreboardContainer.css("width", lc.scoreboardWidth + "px" );
		this._scoreboardContainer.css("height", lc.scoreboardHeight + "px" );
		this._scoreboardContainer.css("font-size", lc.scoreboardElementHeight + "px");
		this._scoreboardElements.forEach(element => element.resize());
	}
	
}
