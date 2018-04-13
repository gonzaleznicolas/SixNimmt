'use strict';

const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');

const AnimationTypes = Object.freeze({
	FlipAllUpcomingCards:1,
	SortUpcomingCards: 2
});
 
module.exports = class GameLogic 
{ 
	constructor() 
	{
	}

	static getAnimationSequence(table, upcomingCards)
	{
		// objects we will use to return the animationSequence
		let beforeImage = undefined;
		let animationList = [];

		let tableAtThisPoint = Table.clone(table);
		let upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCards);

		// BEFORE

		beforeImage =
		{
			table: tableAtThisPoint.Table,
			upcomingCards:
			{
				bFaceUp: false,
				cards: upcomingCardsAtThisPoint.Cards,
				highlighted: null
			}
		}

		// FLIP

		tableAtThisPoint = Table.clone(tableAtThisPoint);
		upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

		animationList[0] =
		{
			animationType: AnimationTypes.FlipAllUpcomingCards,
			afterImage:
			{
				table: tableAtThisPoint.Table,
				upcomingCards:
				{
					bFaceUp: true,
					cards: upcomingCardsAtThisPoint.Cards,
					highlighted: null
				}
			}
		};

		// SORT

		tableAtThisPoint = Table.clone(tableAtThisPoint);
		upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

		upcomingCardsAtThisPoint.sort();

		animationList[1] =
		{
			animationType: AnimationTypes.SortUpcomingCards,
			afterImage:
			{
				table: tableAtThisPoint.Table,
				upcomingCards:
				{
					bFaceUp: true,
					cards: upcomingCardsAtThisPoint.Cards,
					highlighted: null
				}
			}
		};



		return {beforeImage: beforeImage, animationList: animationList};
	}
}
