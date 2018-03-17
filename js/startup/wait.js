"use strict";

const TypeOfLoadingScreen = Object.freeze({"PersonWhoStartedTheGame":1, "PersonJoiningOrSpectator":2})

let loadingScreenType = TypeOfLoadingScreen.PersonWhoStartedTheGame;
let gameCode = 3424;
let bSpanish = true;

$(function () {
	bSpanish ? onSpanish() : onEnglish();

	$("#code")[0].innerHTML = gameCode;
	setRightButtons(loadingScreenType);

	// add all current players
	addPlayer("Nico");

	drawCow();
	fadeCow();
 	animateDots();
});

function onEnglish() {
	$('#theCodeIs')[0].innerHTML = "The game code is";
	playerAllowance
	$('#playerAllowance')[0].innerHTML = "2-10 players allowed";

	$('#endGameBtn')[0].innerHTML = "End game";
	$('#quitGameBtn')[0].innerHTML = "Quit game";
	$('#startGameBtn')[0].innerHTML = "Start with current players";
}

function onSpanish() {
	$('#theCodeIs')[0].innerHTML = "El codigo del juego es";
	playerAllowance
	$('#playerAllowance')[0].innerHTML = "2-10 jugadores permitidos";

	$('#endGameBtn')[0].innerHTML = "Terminar juego";
	$('#quitGameBtn')[0].innerHTML = "Salir";
	$('#startGameBtn')[0].innerHTML = "Comenzar con estos jugadores";
}

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
// must add at least one player (dot) before calling this function
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
