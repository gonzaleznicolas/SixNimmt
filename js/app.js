"use strict";

let bSpectatorMode = false;
let numberOfPlayers = 10;
let bFlickityEnabled = true;

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

let lc = undefined;

$(function () {
	lc = new LayoutCalculator();
	sixNimmtModel = new SixNimmtModel();
	sixNimmtView = new SixNimmtView(sixNimmtModel);
	menuView = new MenuView();
	sixNimmtController = new SixNimmtController(sixNimmtModel, sixNimmtView, menuView);
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
let sixNimmtModel = undefined;
let sixNimmtView = undefined;
let menuView = undefined;
let sixNimmtController = undefined;

function move(row1, col1, row2, col2) {
	sixNimmtView._tableAnimation.moveCard(row1, col1, row2, col2);
}

function add(player, num)
{
	sixNimmtView._scoreboard.incrementScore(player, num);
}

function flip()
{
	sixNimmtView._tableAnimation.flipAllUpcomingCards();
	sixNimmtModel.UpcomingCardsFaceUp = true;
}

function takeRow(i)
{
	sixNimmtView._tableAnimation.takeRow(i);
}

function moveIthUpcomingCardToRowCol(i, r, c)
{
	sixNimmtModel.UpcomingCardsCurrentlyInAnimation = [i];
	sixNimmtView._tableAnimation.moveIthUpcomingCardToRowCol(i, r, c);
}

function sortUpcomingCards(i, j)
{
	sixNimmtModel.UpcomingCardsCurrentlyInAnimation = [i];
	sixNimmtView._tableAnimation.sortUpcomingCards(i, j);
}

