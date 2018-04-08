"use strict";

class ScoreboardElement
{
		constructor(playerName)
		{
			this._div = $(document.createElement("div"));
			this._div.addClass("scoreboardElement");
			this._playerName = playerName;
			this._playerScore = 0;
			this.updateText();
		}

		get Name() {return this._playerName}
		get Score() {return this._playerScore}
		get Div() {return this._div}

		incrementScoreBy(n)
		{
				this._playerScore += n;
				this.updateText();
		}

		updateText()
		{
			// set the width of the name colujmn to 100%. that makes it take up as much space as possible. this is like aligning the score to the right
			this._div[0].innerHTML ="<table><col width=\"100%\"><tr><td>" + this._playerName + "</td><td>" + this._playerScore + "</td></tr></table>"
		}

		makePink(){this._div.addClass("pink");}

		makeWhite(){this._div.removeClass("pink");}

		resize()
		{
				this._div.css("width", lc.scoreboardElementWidth + "px");
				this._div.css("height", lc.scoreboardElementHeight + "px");
		}
}