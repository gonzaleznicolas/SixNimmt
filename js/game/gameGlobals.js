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

	RoundStepTypes:
	{
		NoAnimationJustTheTableImage: 1,
		FlipAllUpcomingCards: 2,
		SortUpcomingCards: 3,
		MoveIthCardToRowCol: 4,
		AskPlayerToChooseARowToTake: 5,
		TakeRow: 6,
		MoveRows: 7
	}
});