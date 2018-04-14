'use strict';

module.exports = Object.freeze(
{
	PlayerStates:
	{
		WaitPage: 1,
		ChooseCard: 2,
		WaitForRestToPlayTheirCard: 3,
		RoundAnimationInProgress: 4,
		RoundAnimationInProgress_ExpectedToSendRowToTake: 5
	},

	GameStates:
	{
		WaitForPlayers: 1,
		WaitForAllPlayersToChooseTheirCard: 2,
		RoundAnimationInProgress: 3
	},

	RoundStepType:
	{
		FlipAllUpcomingCards:1,
		SortUpcomingCards: 2,
		MoveIthCardToRowCol: 3,
		AskPlayerToChooseARowToTake: 4,
		NoAnimationJustTheTableImage: 5,
		TakeRow: 6,
		MoveRows: 7
	}
});