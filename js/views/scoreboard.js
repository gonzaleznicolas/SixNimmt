"use strict";

class Scoreboard
{
	constructor(players)
	{
		this._scoreboardContainer = $("#scoreboard");

		// make a ScoreboardElement object for each player
		this._scoreboardElements = players.map(playerName => {return new ScoreboardElement(playerName)});

		// put all the ScoreboardElements in the scoreboardContainer
		this.putElementsInContainer();
	}

	incrementScore(playerName, incrementBy)
	{
		// if there is already an increment score animation in progress, wait half a second and try again.
		if (this._indexOfElementBeingUpdated != undefined)
		{
			setTimeout( this.incrementScore.bind(this), 500, playerName, incrementBy);
			return;
		}
		this._indexOfElementBeingUpdated = this._scoreboardElements.findIndex(element => element.name == playerName);
		this._elementBeingMoved = this._scoreboardElements[this._indexOfElementBeingUpdated];
		this._elementBeingMoved.incrementScoreBy(incrementBy);
		// make the element being moved pink
		this._elementBeingMoved.makePink();
		this._incrementScoreInterval = setInterval(this.incrementScoreAnimationHelper.bind(this), 300);
	}

	incrementScoreAnimationHelper()
	{
		// move the element which had its score incremented until it is in the right place
		if (this._indexOfElementBeingUpdated == this._scoreboardElements.length - 1 ||
			this._elementBeingMoved.score <=
			this._scoreboardElements[this._indexOfElementBeingUpdated+1].score)
		{
			clearInterval(this._incrementScoreInterval);
			// wait one second to make it white again
			setTimeout( function(element){element.makeWhite();}, 1000, this._elementBeingMoved);
			this._elementBeingMoved = undefined;
			this._indexOfElementBeingUpdated = undefined;
		}
		else
		{
			this._scoreboardContainer.empty();
			this._scoreboardElements[this._indexOfElementBeingUpdated] = this._scoreboardElements[this._indexOfElementBeingUpdated + 1];
			this._scoreboardElements[this._indexOfElementBeingUpdated + 1] = this._elementBeingMoved;
			this._indexOfElementBeingUpdated++;
			this.putElementsInContainer();
		}
	}

	putElementsInContainer()
	{
		this._scoreboardElements.forEach(element => this._scoreboardContainer.append(element.div));
	}

	resize()
	{
		this._scoreboardContainer.css("width", lc.scoreboardWidth + "px" );
		this._scoreboardContainer.css("height", lc.scoreboardHeight + "px" );
		this._scoreboardContainer.css("font-size", lc.scoreboardElementHeight + "px");
		this._scoreboardElements.forEach(element => element.resize());
	}
	
}
