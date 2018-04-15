'use strict';

module.exports = Object.freeze(
{
	PlayerStates:
	{
		WaitPage: 1,
		ChooseCard: 2,
		WaitForRestToPlayTheirCard: 3,
		RoundAnimationInProgress: 4,
		RoundAnimationInProgress_ExpectedToSendRowToTake: 5,
		DoneDisplayingRoundAnimation: 6
	},

	SpectatorStates:
	{
		RoundAnimationNotInProgress: 1,
		RoundAnimationInProgress: 2,
		DoneDisplayingRoundAnimation: 3
	},

	GameStates:
	{
		WaitForPlayers: 1,
		WaitForAllPlayersToChooseTheirCard: 2,
		RoundAnimationInProgress: 3
	},

	RoundStepTypes:
	{
		NoAnimationJustTheTableImage: 1,
		FlipAllUpcomingCards: 2,
		SortUpcomingCards: 3,
		MoveIthCardToRowCol: 4,
		AskPlayerToChooseARowToTake: 5,
		TakeRow: 6,
		MoveRows: 7,
		ShowMessageSayingWhichRowWasSelected: 8,
		ClearHeader: 9,
		RoundDone: 10,
		IncrementPlayerScore: 11
	}
});