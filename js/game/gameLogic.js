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

		let beforeImage =
		{
			table: table.Table,
			upcomingCards:
			{
				bFaceUp: false,
				cards: upcomingCards.Cards,
				highlighted: null
			}
		}

		let animationList = [];

		animationList[0] =
		{
			animationType: AnimationTypes.FlipAllUpcomingCards,
			afterImage:
			{
				table: table.Table,
				upcomingCards:
				{
					bFaceUp: true,
					cards: upcomingCards.Cards,
					highlighted: null
				}
			}
		};

		animationList[1] =
		{
			animationType: AnimationTypes.SortUpcomingCards,
			afterImage:
			{
				table: table.Table,
				upcomingCards:
				{
					bFaceUp: true,
					cards: upcomingCards.Cards.slice(0).sort((a, b) => a.number - b.number),
					highlighted: null
				}
			}
		};

		return {beforeImage: beforeImage, animationList: animationList};
	}
}
