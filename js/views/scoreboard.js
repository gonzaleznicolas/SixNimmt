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
		
		let elementHeight = undefined;
		let elementWidth = undefined;
		if (lc.bScoreboardBelowGallery)
		{
			let scoreboardElementsPerRow = 4;
			let numberOfRows = Math.ceil(numberOfPlayers/scoreboardElementsPerRow);
			elementWidth = (lc.galleryWidth - (scoreboardElementsPerRow + 1)*lc.margin)/scoreboardElementsPerRow;
			elementHeight = elementWidth * (1/lc.scoreboardElementHeightToWidthFactor);
		}
		else
		{
			elementWidth = lc.scoreboardWidth;
			elementHeight = (lc.galleryHeight - 11*lc.margin)/10;
		}
		for (let i = 0; i < numberOfPlayers; i++)
		{
			let e = $(document.createElement("div"));
			e.addClass("scoreboardElement");
			e.css("width", elementWidth + "px");
			e.css("height", elementHeight + "px");
			this._scoreboardContainer.append(e);
		}
	}
	
	resize()
	{
		this._scoreboardContainer.css("width", lc.scoreboardWidth + "px" );
		this._scoreboardContainer.css("height", lc.scoreboardHeight + "px" );
	}
	
}
