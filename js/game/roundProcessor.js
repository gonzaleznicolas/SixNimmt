'use strict';

const Table = require('./table.js');
const UpcomingCards = require('./upcomingCards.js');
const Scoreboard = require('./scoreboard.js');
const RoundStepTypes = require('./gameGlobals.js').RoundStepTypes;
 
module.exports = class RoundProcessor 
{ 
	constructor(gamesTable, gamesUpcomingCards, gamesScoreboard) 
	{
		// these are pointers to the game's table and upcoming cards. Modifying these
		// modifies the game's data. Thus, for any intermediate steps, make clones
		this._gamesTable = gamesTable;
		this._gamesUpcomingards = gamesUpcomingCards;
		this._gamesScoreboard = gamesScoreboard;

		// these partial round step sequences will be filled out by the first and potential second calls
		// to doAsMuchOfRoundAsPossible.
		// before returning, each execution of doAsMuchOfRoundAsPossible will set the roundStepSequence its about to return into
		// this._firstRoundStepSequence or this._potentialSecondRoundStepSequence
		// These will later be used by getFullRoundStepSequence().
		this._firstRoundStepSequence = [];
		this._potentialSecondRoundStepSequence = [];
	}

	// returns a roundStepSequence array which represents the full round. No interruption for
	// asking a player to select a row to take
	getFullRoundStepSequence()
	{
		let roundStepSequence = this._firstRoundStepSequence.concat(this._potentialSecondRoundStepSequence);
		return roundStepSequence.filter((step) => step.stepType != RoundStepTypes.AskPlayerToChooseARowToTake);
	}

	// bStartOfRound = true means the round is starting rather than resuming after a player chose a row to take
	// false means it is starting after a player chose which row to take
	// rowToTake and nameOfPlayerWhoTookRow are only passed in if !bStartOfRound
	doAsMuchOfRoundAsPossible(bStartOfRound, rowToTake, nameOfPlayerWhoTookRow)
	{
		if (bStartOfRound)
		{
			this._firstRoundStepSequence = [];
			this._potentialSecondRoundStepSequence = [];
		}
		let roundStepSequence = [];
		let tableAtThisPoint;
		let upcomingCardsAtThisPoint;
		let scoreboardAtThisPoint;

		// before sending any animation out, reset the scoreboard. This is important in case any player's names
		// have changed. i.e. a human player left and was replaced by an AI with a different name
		scoreboardAtThisPoint = Scoreboard.clone(this._gamesScoreboard);
		roundStepSequence.push(
		{
			stepType: RoundStepTypes.ResetScoreboard,
			scoreboard: scoreboardAtThisPoint.Scores
		});

		if (bStartOfRound)
		{
			// initial table image
			tableAtThisPoint = Table.clone(this._gamesTable);
			upcomingCardsAtThisPoint = UpcomingCards.clone(this._gamesUpcomingards);
			scoreboardAtThisPoint = Scoreboard.clone(this._gamesScoreboard);

			roundStepSequence.push(
			{
				stepType: RoundStepTypes.NoAnimationJustTheTableImage,
				tableImage:
				{
					table: tableAtThisPoint.Table,
					upcomingCards:
					{
						bFaceUp: false,
						cards: upcomingCardsAtThisPoint.Cards,
						highlighted: null,
						onlyDrawCardsAfterThisIndex: -1
					}
				}
			});

			// flip upcoming cards
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);

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
						highlighted: null,
						onlyDrawCardsAfterThisIndex: -1
					}
				}
			});

			// sort upcoming cards
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);

			// sort the cards on the object so that when we draw, the cards are in the place that the
			// animation moved them to
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
						highlighted: null,
						onlyDrawCardsAfterThisIndex: -1
					}
				}
			});
			
			roundStepSequence.push({stepType: RoundStepTypes.ClearHeader});
		}
		else
		{
			let indexOfTheCardThatCausedTheSelectRowToTake = this._gamesUpcomingards.Cards.findIndex( (element) => element != null);

			roundStepSequence.push(
			{
				stepType: RoundStepTypes.ShowMessageSayingWhichRowWasSelected,
				stepParams:
				{
					rowSelected: rowToTake,
					nameOfPlayerWhoTookRow: nameOfPlayerWhoTookRow 
				}
			}
			);

			// take the row selected by the player
			tableAtThisPoint = Table.clone(this._gamesTable);
			upcomingCardsAtThisPoint = UpcomingCards.clone(this._gamesUpcomingards);
			scoreboardAtThisPoint = Scoreboard.clone(this._gamesScoreboard);
			let numberOfCowsTaken = tableAtThisPoint.emptyRow(rowToTake);
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
						highlighted: indexOfTheCardThatCausedTheSelectRowToTake,
						onlyDrawCardsAfterThisIndex: -1
					}
				}
			});

			// increment the player's score
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);
			scoreboardAtThisPoint.incrementPlayerScore(nameOfPlayerWhoTookRow, numberOfCowsTaken);
			roundStepSequence.push(
			{
				stepType: RoundStepTypes.IncrementPlayerScore,
				stepParams:
				{
					playerName: nameOfPlayerWhoTookRow,
					pointsToAdd: numberOfCowsTaken
				},
				scoreboardAfter: scoreboardAtThisPoint.Scores
			});

			// move rows so 0th row is empty
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);
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
						highlighted: indexOfTheCardThatCausedTheSelectRowToTake,
						onlyDrawCardsAfterThisIndex: -1
					}
				}
			});

			// move the the card that caused the select row into the 0th row
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);
			tableAtThisPoint.putCardInEmptyFirstsRow(upcomingCardsAtThisPoint.Cards[indexOfTheCardThatCausedTheSelectRowToTake]);
			upcomingCardsAtThisPoint.Cards[indexOfTheCardThatCausedTheSelectRowToTake] = null;
			roundStepSequence.push(
			{
				stepType: RoundStepTypes.MoveIthCardToRowCol,
				stepParams:
				{
					i: indexOfTheCardThatCausedTheSelectRowToTake,
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
						highlighted: null,
						onlyDrawCardsAfterThisIndex: -1
					}
				}
			});

			roundStepSequence.push({stepType: RoundStepTypes.ClearHeader});
		}

		// HANDLE UPCOMING CARDS
		let needToAskThisPlayerForARowToTake = undefined; // undefined if no need to ask. turn complete by this roundStepSequence

		let numberOfUpcomingCardsForTheRound = this._gamesUpcomingards.Size;
		for ( let upcomingCardIndex =  upcomingCardsAtThisPoint.Cards.findIndex( (element) => element != null); 
			upcomingCardIndex < numberOfUpcomingCardsForTheRound; upcomingCardIndex++)
		{
			tableAtThisPoint = Table.clone(tableAtThisPoint);
			upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
			scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);

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
					},
					tableImage:
					{
						table: tableAtThisPoint.Table,
						upcomingCards:
						{
							bFaceUp: true,
							cards: upcomingCardsAtThisPoint.Cards,
							highlighted: upcomingCardIndex,
							onlyDrawCardsAfterThisIndex: -1
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
							highlighted: null,
							onlyDrawCardsAfterThisIndex: -1
						}
					}
				});

				if (rowCol.col == 5) // if the card was the 6th (index 5) of the row
				{
					// take the full row
					tableAtThisPoint = Table.clone(tableAtThisPoint);
					upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
					scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);
					let numberOfCowsTaken = tableAtThisPoint.takeFullRow(rowCol.row);

					roundStepSequence.push(
					{
						stepType: RoundStepTypes.TakeRow,
						stepParams:
						{
							rowIndex: rowCol.row,
							bDisapearAtTheEnd: false
						},
						afterImage:
						{
							table: tableAtThisPoint.Table,
							upcomingCards:
							{
								bFaceUp: true,
								cards: upcomingCardsAtThisPoint.Cards,
								highlighted: null,
								onlyDrawCardsAfterThisIndex: -1
							}
						}
					});

					// increment player's score
					tableAtThisPoint = Table.clone(tableAtThisPoint);
					upcomingCardsAtThisPoint = UpcomingCards.clone(upcomingCardsAtThisPoint);
					scoreboardAtThisPoint = Scoreboard.clone(scoreboardAtThisPoint);
					scoreboardAtThisPoint.incrementPlayerScore(upcomingCardToPlace.name, numberOfCowsTaken);
					roundStepSequence.push(
					{
						stepType: RoundStepTypes.IncrementPlayerScore,
						stepParams:
						{
							playerName: upcomingCardToPlace.name,
							pointsToAdd: numberOfCowsTaken
						},
						scoreboardAfter: scoreboardAtThisPoint.Scores
					});
				}
			}
		}

		this._gamesTable.Table = Table.clone(tableAtThisPoint).Table;
		this._gamesUpcomingards.Cards = UpcomingCards.clone(upcomingCardsAtThisPoint).Cards;
		this._gamesScoreboard.Scores = Scoreboard.clone(scoreboardAtThisPoint).Scores;

		let bRoundRanToCompletion = this._gamesUpcomingards.Cards.every( (card) => card == null);
		if (bRoundRanToCompletion)
		{
			roundStepSequence.push(
			{
				stepType: RoundStepTypes.RoundDone,
				tableImage:
				{
					table: this._gamesTable.Table,
					upcomingCards:
					{
						bFaceUp: true,
						cards: this._gamesUpcomingards.Cards,
						highlighted: null,
						onlyDrawCardsAfterThisIndex: -1
					}
				}
			});
		}

		// set these members. They will be used by getFullRoundStepSequence()
		if (bStartOfRound)
			this._firstRoundStepSequence = roundStepSequence;
		else
			this._potentialSecondRoundStepSequence = roundStepSequence;

		return {
			needToAskThisPlayerForARowToTake: needToAskThisPlayerForARowToTake,
			roundStepSequence: roundStepSequence
		};
	}
}
