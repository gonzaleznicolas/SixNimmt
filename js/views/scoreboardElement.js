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

    get name() {return this._playerName}
    get score() {return this._playerScore}
    get div() {return this._div}

    incrementScoreBy(n)
    {
        this._playerScore += n;
        this.updateText();
    }

    updateText()
    {
        this._div[0].innerHTML = this._playerName + ":" + this._playerScore;
    }

    makePink(){this._div.addClass("pink");}

    makeWhite(){this._div.removeClass("pink");}

    resize()
    {
        this._div.css("width", lc.scoreboardElementWidth + "px");
        this._div.css("height", lc.scoreboardElementHeight + "px");
    }
}