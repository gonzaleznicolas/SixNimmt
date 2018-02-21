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
	
	resize(galleryWidth, galleryHeight)
	{
		const windowWidth = $(window).width();
		const windowHeight = $(window).height() - $('header').height();
		
		const spaceBelowGallery = Math.abs(galleryHeight - windowHeight);
		const spaceLeftOfGallery = Math.abs(galleryWidth - windowWidth);
		
		// set scoreboard dimensions
		if (spaceLeftOfGallery>= minScoreboardWidthWhenOnSide && spaceLeftOfGallery >= spaceBelowGallery)
		{
			// place the scoreboard to the left of the gallery
			$("#game").css("flex-direction", "row-reverse");
			$("#game").css("justify-content", "flex-end");
			$("#scoreboard").css("padding", 0 + "px" );
			$("#scoreboard").css("text-align", "center" );
			$("#scoreboard").css("width", Math.min(maxScoreboardWidthWhenOnSide, spaceLeftOfGallery) + "px" );
			$("#scoreboard").css("height", galleryHeight + "px" );

			const scoreboardWidth = $('#scoreboard').width();
			const fontSize = 0.1 * scoreboardWidth;
			$('#scoreboard').css("font-size", fontSize+"px");
		}
		else
		{
			// place the scoreboard below the gallery
			$("#game").css("flex-direction", "column");
			$("#scoreboard").css("padding-left", spaceForOneFlickityArrow + margin + "px" );
			$("#scoreboard").css("text-align", "left" );
			$("#scoreboard").css("align-items", "flex-start");
			$("#scoreboard").css("width", windowWidth + "px" );

			const scoreboardHeight = $('#scoreboard').width();
			const fontSize = 0.07 * scoreboardHeight;
			$('#scoreboard').css("font-size", fontSize+"px");
		}
	}
	
}
