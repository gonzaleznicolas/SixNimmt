"use strict";

$(function () {
	sixNimmtModel = new SixNimmtModel();
	sixNimmtView = new SixNimmtView(sixNimmtModel);
});

let sixNimmtModel = undefined;
let sixNimmtView = undefined;

function getCardInfo(cardNumber)
{
	if (cardNumber )
	{
		if (cardNumber === 55)
			return {negativePts: 7, cowColor: "red", numColor: "yellow", cardColor: "purple"};
		else if ( cardNumber % 11 === 0)
			return {negativePts: 5, cowColor: "blue", numColor: "#ffbc00", cardColor: "red"};
		else if (cardNumber % 10 === 0)
			return {negativePts: 3, cowColor: "red", numColor: "#85c7e0", cardColor: "#ffbc00"};
		else if (cardNumber % 5 === 0)
			return {negativePts: 2, cowColor: "blue", numColor: "yellow", cardColor: "#85c7e0"};
		else
			return {negativePts: 1, cowColor: "#7f5093", numColor: "white", cardColor: "white"};
	}
	else // undefined passed in therefore info for back of card
		return {cowColor: "#7f5093", cardColor: "white"}
}

// for testing purposes
function flip(row, col, num) {
	sixNimmtView._gameAnimation.flipCard(row, col, num);
}

function getOffsetLeft(elem)
{
	let offsetLeft = 0;
	do{
		if( !isNaN(elem.offsetLeft))
		{
			offsetLeft += elem.offsetLeft;
		}
	}while( elem = elem.parentElement);
	return offsetLeft;
}

function getOffsetTop(elem)
{
	let offsetTop = 0;
	do{
		if( !isNaN(elem.offsetTop))
		{
			offsetTop += elem.offsetTop;
		}
	}while( elem = elem.parentElement);
	return offsetTop;
}
