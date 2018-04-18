"use strict";

let bSpectatorMode;
let numberOfPlayers;
let bFlickityEnabled = true;
let lc = undefined;	// layoutCalculator - initiallized in the gameController

// game constants
const MAX_NUMBER_OF_PLAYERS = 10;
const NUMBER_OF_ROWS_ON_HAND_CANVAS = 2;
const NUMBER_OF_COLS_ON_HAND_CANVAS = 5;
const NUMBER_OF_ROWS_ON_TABLE_CANVAS = 4;
const NUMBER_OF_COLS_ON_TABLE_CANVAS_NOT_INCLUDING_COLS_FOR_CARDS_PLAYED_THIS_TURN = 6;

// global variables
let bAnimationInProgress = false;

// global enums
const ClientStates = Object.freeze({
	NotPastFormYet:1,
	WaitingForFormResult:2,
	WaitPage: 3,
	ChooseCard: 4,
	WaitForRestToPlayTheirCard: 5,
	RoundAnimationInProgress: 6,
	SelectRowToTake: 7
});

const RoundStepTypes = Object.freeze(
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
		IncrementPlayerScore: 11,
		ResetScoreboard: 12
	}
);

function getCardInfo(cardNumber)
{
	if (cardNumber )
	{
		if (cardNumber === 55)
			return {negativePts: 7, cowColor: "rgba(255, 0, 0, 1)", numColor: "rgba(255, 255,	0, 1)", cardColor: "rgba(115, 60, 110, 1)"};
		else if ( cardNumber % 11 === 0)
			return {negativePts: 5, cowColor: "rgba(0, 0, 100, 1)", numColor: "rgba(255, 188, 0, 1)", cardColor: "rgba(255, 0, 0, 1)"};
		else if (cardNumber % 10 === 0)
			return {negativePts: 3, cowColor: "rgba(255, 0, 0, 1)", numColor: "rgba(133, 199, 224, 1)", cardColor: "rgba(255, 188, 0, 1)"};
		else if (cardNumber % 5 === 0)
			return {negativePts: 2, cowColor: "rgba(0, 0, 100, 1)", numColor: "rgba(255, 255,	0, 1)", cardColor: "rgba(133, 199,	224, 1)"};
		else
			return {negativePts: 1, cowColor: lc.nimmtPurple, numColor: "rgba(255, 255,	255, 1)", cardColor: "rgba(255, 255,	255, 1)"};
	}
	else // undefined passed in therefore info for back of card
		return {cowColor: lc.nimmtPurple, cardColor: "rgba(255, 255,	255, 1)"}
}

let controller = undefined;
