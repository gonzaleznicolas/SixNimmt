"use strict";

let bSpectatorMode = false;
let numberOfPlayers = 10;
let bFlickityEnabled = true;
let bSpanish = true;

// game constants
const MAX_NUMBER_OF_PLAYERS = 10;
const NUMBER_OF_ROWS_ON_HAND_CANVAS = 2;
const NUMBER_OF_COLS_ON_HAND_CANVAS = 5;
const NUMBER_OF_ROWS_ON_TABLE_CANVAS = 4;
const NUMBER_OF_COLS_ON_TABLE_CANVAS_NOT_INCLUDING_COLS_FOR_CARDS_PLAYED_THIS_TURN = 6;

// global variables
let bAnimationInProgress = false;

// global enums
const HandState = Object.freeze({"PlayCard":1, "NotTimeToPlayCard":2})
const TableState = Object.freeze({"SelectRowToTake":1, "Normal":2})

let lc = undefined;	// layoutCalculator - initiallized in the gameController

$(function () {
	controller = new GameController();
});

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

// TEMPORARY:
let controller = undefined;

function move(row1, col1, row2, col2) {
	controller._tableView.Animation.moveCard(row1, col1, row2, col2);
}

function add(player, num)
{
	controller._gameLayoutController._scoreboard.incrementScore(player, num);
}

function flip()
{
	controller._tableView.Animation.flipAllUpcomingCards();
	controller._model.UpcomingCardsFaceUp = true;
}

function takeRow(i, b)
{
	controller._tableView.Animation.takeRow(i, b);
}

function moveIthUpcomingCardToRowCol(i, r, c)
{
	controller._tableView.Animation.moveIthUpcomingCardToRowCol(i, r, c);
}

function sortUpcomingCards()
{
	controller._tableView.Animation.sortUpcomingCards();
}

function moveRows(fromRow, toRow, downThisManyRows)
{
	controller._tableView.Animation.moveRows(fromRow, toRow, downThisManyRows);
}

