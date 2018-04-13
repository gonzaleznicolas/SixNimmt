'use strict';

const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');

const AnimationTypes = Object.freeze({
	FlipAllUpcomingCards:1,
	SortUpcomingCards: 2,
	MoveIthCardToRowCol: 3,
	AskPlayerToChooseARowToTake: 4
});
 
module.exports = class GameLogic 
{ 
	constructor() 
	{
	}

	static doAsMuchOfRoundAsPossible(originalTable, originalUpcomingCards)
	{
		// objects we will use to create the animationSequence
		let beforeImage = undefined;
		let animationList = [];

		//

		let tableAtThisPoint = Table.clone(originalTable);
		let upcomingCardsAtThisPoint = UpcomingCards.clone(originalUpcomingCards);
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
		let needToAskThisPlayerForARowToTake = undefined; // undefined if no need to ask. turn complete by this animationSequence

		let numberOfUpcomingCards = upcomingCardsAtThisPoint.Size;
		for ( let upcomingCardIndex = 0; upcomingCardIndex < numberOfUpcomingCards; upcomingCardIndex++)
		{
			animationListIndex++;
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

			let card = upcomingCardsAtThisPoint.Cards[upcomingCardIndex];
			if (tableAtThisPoint.cardSmallerThanLastCardInFirstRow(card.number))
			{
				console.log("Card smaller than last card in first row...");
				needToAskThisPlayerForARowToTake = card.name;
				animationList[animationListIndex] =
				{
					animationType: AnimationTypes.AskPlayerToChooseARowToTake,
					animationParams:
					{
						nameOfPlayerToChooseRow: card.name,
						tableImage:
						{
							table: tableAtThisPoint.Table,
							upcomingCards:
							{
								bFaceUp: true,
								cards: upcomingCardsAtThisPoint.Cards,
								highlighted: upcomingCardIndex
							}
						}
					}
				};

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

		originalTable = tableAtThisPoint;
		originalUpcomingCards = upcomingCardsAtThisPoint;

		let animationSequence = {beforeImage: beforeImage, animationList: animationList};

		return {
			needToAskThisPlayerForARowToTake: needToAskThisPlayerForARowToTake,
			animationSequence: animationSequence
		};
	}
}
