'use strict';

const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');

const AnimationTypes = Object.freeze({
	FlipAllUpcomingCards:1,
	SortUpcomingCards: 2,
	MoveIthCardToRowCol: 3
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

		//

		let tableAtThisPoint = Table.clone(table);
		let upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCards);
		let animationListIndex = 0;

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

		animationList[animationListIndex] =
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

		animationListIndex++;
		tableAtThisPoint = Table.clone(tableAtThisPoint);
		upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

		upcomingCardsAtThisPoint.sort();

		animationList[animationListIndex] =
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

		// HANDLE UPCOMING CARDS
		for ( let upcomingCardIndex = 0; upcomingCardIndex < upcomingCardsAtThisPoint.Size; upcomingCardIndex++)
		{
			animationListIndex++;
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

			let card = upcomingCardsAtThisPoint.Cards[upcomingCardIndex];
			if (tableAtThisPoint.cardSmallerThanLastCardInFirstRow(card.number))
			{
				console.log("Card smaller than last card in first row...");
				break;
			}
			else
			{
				let rowCol = tableAtThisPoint.playCard(card.number);
				upcomingCardsAtThisPoint.Cards[upcomingCardIndex] = null;
				animationList[animationListIndex] =
				{
					animationType: AnimationTypes.MoveIthCardToRowCol,
					animationParams:
					{
						i: upcomingCardIndex,
						tableRow: rowCol.row,
						tableCol: rowCol.col
					},
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
			}
		}

		return {beforeImage: beforeImage, animationList: animationList};
	}
}
