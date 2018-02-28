"use strict";

let bSpectatorMode = false;
let numberOfPlayers = 10;
let flickityEnabled = true;

let lc = undefined;

$(function () {
	lc = new LayoutCalculator();
	sixNimmtModel = new SixNimmtModel();
	sixNimmtView = new SixNimmtView(sixNimmtModel);
	menuView = new MenuView();
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
			return {negativePts: 1, cowColor: "rgba(127, 80, 147, 1)", numColor: "rgba(255, 255,	255, 1)", cardColor: "rgba(255, 255,	255, 1)"};
	}
	else // undefined passed in therefore info for back of card
		return {cowColor: "rgba(127, 80, 147, 1)", cardColor: "rgba(255, 255,	255, 1)"}
}

// TEMPORARY:
let sixNimmtModel = undefined;
let sixNimmtView = undefined;
let menuView = undefined;

function move(row1, col1, row2, col2) {
	sixNimmtView._tableAnimation.moveCard(row1, col1, row2, col2);
}


