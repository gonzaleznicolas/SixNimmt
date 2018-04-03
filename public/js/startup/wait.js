"use strict";

const TypeOfLoadingScreen = Object.freeze({"PersonWhoStartedTheGame":1, "PersonJoiningOrSpectator":2})

let loadingScreenType = TypeOfLoadingScreen.PersonWhoStartedTheGame;
let gameCode = 3424;

let numberOfPlayersSoFar = 0;


//replace this with function startWaitPage()
$(function () {
	$("#code")[0].innerHTML = gameCode;
	updateButtons();

	// add all current players
	addPlayer("Nico");

	drawCow();
	fadeCow();
	animateDots();

	$('#endGameBtn')[0].addEventListener("click", endGame, false);
	$('#quitGameBtn')[0].addEventListener("click", quitGame, false);
	$('#startGameBtn')[0].addEventListener("click", startGame, false);
	$('#addAIBtn')[0].addEventListener("click", addAI, false);
});

function endGame()
{

}

function quitGame()
{

}

function startGame()
{

}

let aiNum = 1;
function addAI()
{
	addPlayer("AI" + aiNum);
	aiNum++;
}

function updateButtons()
{
	if (loadingScreenType == TypeOfLoadingScreen.PersonWhoStartedTheGame)
	{
		$("#buttons").children().hide();
		$("#endGameBtn").show();
		if (numberOfPlayersSoFar < 10)
			$('#addAIBtn').show();
		if (numberOfPlayersSoFar >= 2)
			$("#startGameBtn").show();
		else {
			$("#needMorePlayers").show();
		}
	}
	else
	{
		$("#buttons").children().hide();
		$("#quitGameBtn").show();
	}
}

function drawCow()
{
	let canvas = $("#waitCow")[0];
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
 $("#waitCow").fadeTo(2000, 0.3, function () { $("#waitCow").fadeTo(2000, 1, fadeCow) })
}


let nextDotIndex = 0;
let animationSpeed = 400;
// must add at least one player (dot) before calling this function
function animateDots()
{
	nextDotIndex = (nextDotIndex + 1) % $("#dots").children().length;
	$("#dots").children().eq(nextDotIndex).hide(animationSpeed, function () { $("#dots").children().eq(nextDotIndex).show(animationSpeed, animateDots); })
}

function addPlayer(nickName)
{
	if (numberOfPlayersSoFar >= 10)
		return;
	$("#dots").append("<div></div>");
	$("#playersJoined").append("<li id=\"" + nickName.toLowerCase() + "\" class=\"player\">"+nickName+"</li>");
	numberOfPlayersSoFar++;
	updateButtons();
}

function removePlayer(nickName)
{
	if (numberOfPlayersSoFar <= 1)
		return;
	$("#dots").children().eq(0).remove();
	$("#" + nickName.toLowerCase()).remove();
	numberOfPlayersSoFar--;
}
