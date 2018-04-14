'use strict';

const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');
const RoundStepTypes = require('./gameGlobals.js').RoundStepTypes;
 
module.exports = class GameLogic 
{ 
	constructor(gamesTable, gamesUpcomingCards) 
	{
		// these are pointers to the game's table and upcoming cards. Modifying these
		// modifies the game's data. Thus, for any intermediate steps, make clones
		this._gamesTable = gamesTable;
		this._gamesUpcomingards = gamesUpcomingCards;
	}

	// bStartOfRound = true means the round is starting rather than resuming after a player chose a row to take
	// false means it is starting after a player chose which row to take
	// rowToTake is only passed in if !bStartOfRound
	doAsMuchOfRoundAsPossible(bStartOfRound, rowToTake)
	{
		let roundStepSequence = [];
		let tableAtThisPoint;
		let upcomingCardsAtThisPoint;

		if (bStartOfRound)
		{
			// INITIAL TABLE IMAGE
			tableAtThisPoint = Table.clone(this._gamesTable);
			upcomingCardsAtThisPoint = UpcomingCards.clone(this._gamesUpcomingards);

			roundStepSequence.push(
			{
				stepType: RoundStepTypes.NoAnimationJustTheTableImage,
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

			roundStepSequence.push(
			{
				stepType: RoundStepTypes.FlipAllUpcomingCards,
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

			roundStepSequence.push(
			{
				stepType: RoundStepTypes.SortUpcomingCards,
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
			// could be non zero. remember as we process each upcoming card, we set it to null.
			// so since this is not the first turn of the round, the next upcoming card would not be at index 0
			let indexOfNextUpcomingCard = this._gamesUpcomingards.Cards.findIndex( (element) => element != null);

			// take the row selected by the player
			tableAtThisPoint = Table.clone(this._gamesTable);
			upcomingCardsAtThisPoint = UpcomingCards.clone(this._gamesUpcomingards);
			tableAtThisPoint.emptyRow(rowToTake);
			roundStepSequence.push(
			{
				stepType: RoundStepTypes.TakeRow,
				stepParams:
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
						highlighted: indexOfNextUpcomingCard
					}
				}
			});

			// move rows so 0th row is empty
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			let moveRowParams = tableAtThisPoint.deleteRow(rowToTake);
			roundStepSequence.push(
			{
				stepType: RoundStepTypes.MoveRows,
				stepParams:
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
						highlighted: indexOfNextUpcomingCard
					}
				}
			});

			// move the next upcoming card into the 0th row
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			tableAtThisPoint.putCardInEmptyFirstsRow(upcomingCardsAtThisPoint.Cards[indexOfNextUpcomingCard]);
			upcomingCardsAtThisPoint.Cards[indexOfNextUpcomingCard] = null;
			roundStepSequence.push(
			{
				stepType: RoundStepTypes.MoveIthCardToRowCol,
				stepParams:
				{
					i: indexOfNextUpcomingCard,
					tableRow: 0,
					tableCol: 0
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

		// HANDLE UPCOMING CARDS
		let needToAskThisPlayerForARowToTake = undefined; // undefined if no need to ask. turn complete by this roundStepSequence

		let numberOfUpcomingCardsForTheRound = this._gamesUpcomingards.Size;
		for ( let upcomingCardIndex =  upcomingCardsAtThisPoint.Cards.findIndex( (element) => element != null); 
			upcomingCardIndex < numberOfUpcomingCardsForTheRound; upcomingCardIndex++)
		{
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);

			let upcomingCardToPlace = upcomingCardsAtThisPoint.Cards[upcomingCardIndex];
			if (tableAtThisPoint.cardSmallerThanLastCardInFirstRow(upcomingCardToPlace.number))
			{
				console.log("Card smaller than last card in first row...");
				needToAskThisPlayerForARowToTake = upcomingCardToPlace.name;
				roundStepSequence.push(
				{
					stepType: RoundStepTypes.AskPlayerToChooseARowToTake,
					stepParams:
					{
						nameOfPlayerToChooseRow: upcomingCardToPlace.name,
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
				let rowCol = tableAtThisPoint.playCard(upcomingCardToPlace.number);
				upcomingCardsAtThisPoint.Cards[upcomingCardIndex] = null;
				roundStepSequence.push(
				{
					stepType: RoundStepTypes.MoveIthCardToRowCol,
					stepParams:
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
			roundStepSequence: roundStepSequence
		};
	}
}
