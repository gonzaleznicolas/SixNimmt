'use strict'; 
 
module.exports = class Scoreboard 
{ 
	constructor() 
	{
		this._scores = []; // array of {name: , score: } pairs
	}

	get Scores() {return this._scores;}
	set Scores(s) {this._scores = s;}

	static clone(scoreboardObj)
	{
		let originalArray = scoreboardObj.Scores;
		let cloneArray = [];
		for (let i = 0; i < originalArray.length; i++)
		{
             cloneArray[i] = {name: originalArray[i].name, score: originalArray[i].score};
		}

		let clone = new Scoreboard();
		clone.Scores = cloneArray;
		return clone;
	}

	// inits these players all with a score of 0
	initScoreboardWithThesePlayers(playerNameList)
	{
		this._scores = playerNameList.map( (playerName) => { return {name: playerName, score: 0}});
	}

	incrementPlayerScore(name, pointsToAdd)
	{
		let i = this._scores.findIndex( (score) => score.name == name);
		if (i == -1)
			throw "Tried to increment score of player which doesnt exist";
		this._scores[i].score = this._scores[i].score + pointsToAdd;
	}
}