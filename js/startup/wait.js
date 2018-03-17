"use strict";

const TypeOfLoadingScreen = Object.freeze({"PersonWhoStartedTheGame":1, "PersonJoiningOrSpectator":2})

let loadingScreenType = TypeOfLoadingScreen.PersonJoiningOrSpectator;
let nameOfPersonWhoStartedGame = "Nico";
let gameCode = 3424;

$(function () {
	$("#code")[0].innerHTML = gameCode;
	setRightButtons(loadingScreenType);
	addPlayer(nameOfPersonWhoStartedGame);
	drawCow();
	fadeCow();
 	animateDots();
});

function setRightButtons()
{
	if (loadingScreenType == TypeOfLoadingScreen.PersonWhoStartedTheGame)
		$("#quitGameBtn").hide();
	else
	{
		$("#quitGameBtn").hide();
		$("#startGameBtn").hide();
	}
}

function drawCow()
{
	let canvas = $("#cow")[0];
	let ctx = canvas.getContext("2d");
	BasicShapeDrawer.drawDetailedCowShape(ctx, canvas.width / 2, canvas.height / 2, canvas.width, 0.9 * canvas.height);
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}

function fadeCow()
{
 $("#cow").fadeTo(2000, 0.3, function () { $("#cow").fadeTo(2000, 1, fadeCow) })
}


let nextDotIndex = 0;
let animationSpeed = 400;
function animateDots()
{
	nextDotIndex = (nextDotIndex + 1) % $("#dots").children().length;
	$("#dots").children().eq(nextDotIndex).hide(animationSpeed, function () { $("#dots").children().eq(nextDotIndex).show(animationSpeed, animateDots); })
}

let numberOfPlayers = 0;
function addPlayer(nickName)
{
	$("#dots").append("<div></div>");
	$("#playersJoined").append("<li class=\"player\">"+nickName+"</li>");
	numberOfPlayers++;
}
