'use strict'; 

const AnimationTypes = Object.freeze({
	FlipAllUpcomingCards:1,
	SortUpcomingCards: 2
});
 
module.exports = class GameLogic 
{ 
	constructor() 
	{
	}

	static run(table, upcomingCards)
	{
		let before =	{
						table: table.Table,
						upcomingCards: 	{
										bFaceUp: false,
										cards: upcomingCards.Cards,
										names: upcomingCards.NamesOnCards
										}
						}
		let animationSequence = [];
		animationSequence[0] = {animationType: AnimationTypes.FlipAllUpcomingCards};
		animationSequence[1] = {animationType: AnimationTypes.SortUpcomingCards};

		return {before: before, animationSequence: animationSequence};
	}
}