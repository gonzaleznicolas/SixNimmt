'use strict';

const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');

const AnimationTypes = Object.freeze({
	FlipAllUpcomingCards:1,
	SortUpcomingCards: 2,
	MoveIthCardToRowCol: 3,
	AskPlayerToChooseARowToTake: 4,
	NoAnimationJustTheTableImage: 5,
	TakeRow: 6,
	MoveRows: 7
});
 
module.exports = class GameLogic 
{ 
	constructor(gamesTable, gamesUpcomingCards) 
	{
		// these are pointers to the game's table and upcoming cards. Modifying these
		// modifies the game's data. Thus, for any intermediate steps, make clones
		this._gamesTable = gamesTable;
		this._gamesUpcomingards = gamesUpcomingCards;
	}

	// bStartOfRound means the animation is starting at the start of the round
	// false means it is starting after a player chose which row to take
	// rowToTake is only passed in if !bStartOfRound
	doAsMuchOfRoundAsPossible(bStartOfRound, rowToTake)
	{
		let animationSequence = [];
		let tableAtThisPoint;
		let upcomingCardsAtThisPoint;

		// could be non zero. remember as we process each upcoming card, we set it to null.
		// so if this is not the first turn of the round, the first upcoming card would not be at index 0
		let indexOfFirstUpcomingCard = this._gamesUpcomingards.Cards.findIndex( (element) => element != null);

		if (bStartOfRound)
		{
			// INITIAL TABLE IMAGE
			tableAtThisPoint = Table.clone(this._gamesTable);
			upcomingCardsAtThisPoint = UpcomingCards.clone(this._gamesUpcomingards);

			animationSequence.push(
			{
				animationType: AnimationTypes.NoAnimationJustTheTableImage,
				afterImage:
				{
					table: tableAtThisPoint.Table,
					upcomingCards:
					{
						bFaceUp: false,
						cards: upcomingCardsAtThisPoint.Cards,
						highlighted: null
					}
				}
			});

			// FLIP

			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

			animationSequence.push(
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
			});

			// SORT

			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

			upcomingCardsAtThisPoint.sort();

			animationSequence.push(
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
			});
		}
		else
		{
			// take the row selected by the player
			tableAtThisPoint = Table.clone(this._gamesTable);
			upcomingCardsAtThisPoint = UpcomingCards.clone(this._gamesUpcomingards);
			tableAtThisPoint.emptyRow(rowToTake);
			animationSequence.push(
			{
				animationType: AnimationTypes.TakeRow,
				animationParams:
				{
					rowIndex: rowToTake,
					bDisapearAtTheEnd: true
				},
				afterImage:
				{
					table: tableAtThisPoint.Table,
					upcomingCards:
					{
						bFaceUp: true,
						cards: upcomingCardsAtThisPoint.Cards,
						highlighted: indexOfFirstUpcomingCard
					}
				}
			});

			// move rows so 0th row is empty
			tableAtThisPoint = Table.clone(this._gamesTable);
			upcomingCardsAtThisPoint = UpcomingCards.clone(this._gamesUpcomingards);
			let moveRowParams = tableAtThisPoint.deleteRow(rowToTake);
			animationSequence.push(
			{
				animationType: AnimationTypes.MoveRows,
				animationParams:
				{
					fromRow: moveRowParams.fromRow,
					toRow: moveRowParams.toRow,
					downThisManyRows: moveRowParams.downThisManyRows
				},
				afterImage:
				{
					table: tableAtThisPoint.Table,
					upcomingCards:
					{
						bFaceUp: true,
						cards: upcomingCardsAtThisPoint.Cards,
						highlighted: indexOfFirstUpcomingCard
					}
				}
			});

			this._gamesTable = tableAtThisPoint;
			this._gamesUpcomingards = upcomingCardsAtThisPoint;
	
			return {
				needToAskThisPlayerForARowToTake: undefined,
				animationSequence: animationSequence
			};
		}

		// HANDLE UPCOMING CARDS
		let needToAskThisPlayerForARowToTake = undefined; // undefined if no need to ask. turn complete by this animationSequence

		let numberOfUpcomingCards = this._gamesUpcomingards.Size;
		for ( let upcomingCardIndex = 0; upcomingCardIndex < numberOfUpcomingCards; upcomingCardIndex++)
		{
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

			let card = upcomingCardsAtThisPoint.Cards[upcomingCardIndex];
			if (tableAtThisPoint.cardSmallerThanLastCardInFirstRow(card.number))
			{
				console.log("Card smaller than last card in first row...");
				needToAskThisPlayerForARowToTake = card.name;
				animationSequence.push(
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
				});

				break;
			}
			else
			{
				let rowCol = tableAtThisPoint.playCard(card.number);
				upcomingCardsAtThisPoint.Cards[upcomingCardIndex] = null;
				animationSequence.push(
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
				});
			}
		}

		this._gamesTable = tableAtThisPoint;
		this._gamesUpcomingards = upcomingCardsAtThisPoint;

		return {
			needToAskThisPlayerForARowToTake: needToAskThisPlayerForARowToTake,
			animationSequence: animationSequence
		};
	}
}
