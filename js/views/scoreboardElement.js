"use strict";

class ScoreboardElement
{
    constructor(playerName)
    {
        this._div = $(document.createElement("div"));
        this._div.addClass("scoreboardElement");
        this.playerName = playerName;
        this.playerScore = 0;
        this.setText(this.playerName, this.playerScore);
    }

    incrementScoreBy(n)
    {
        this.playerScore += n;
    }

    setText(name, score)
    {
        this._div[0].innerHTML = name + ":" + score;
    }

    resize()
    {
        this._div.css("width", lc.scoreboardElementWidth + "px");
        this._div.css("height", lc.scoreboardElementHeight + "px");
    }
}