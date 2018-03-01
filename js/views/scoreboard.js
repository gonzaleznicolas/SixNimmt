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
		
		let sidelength = undefined;
		if (lc.bScoreboardBelowGallery)
		{
			sidelength = (lc.galleryWidth  - 6*lc.margin)/5;
		}
		else
		{
			sidelength = (lc.galleryHeight  - 6*lc.margin)/5;
		}
		for (let i = 0; i < numberOfPlayers; i++)
		{
			let e = $(document.createElement("div"));
			e.addClass("scoreboardElement");
			e.css("width", sidelength + "px");
			e.css("height", sidelength + "px");
			this._scoreboardContainer.append(e);
		}
	}
	
	resize()
	{
		this._scoreboardContainer.css("width", lc.scoreboardWidth + "px" );
		this._scoreboardContainer.css("height", lc.scoreboardHeight + "px" );
	}
	
}
