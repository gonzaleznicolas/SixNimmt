"use strict";

//replace this with function startWaitPage()
function startWaitPage(gc, lst, firstPlayer) {
	gameCode = gc;
	loadingScreenType = lst;
	$("#code")[0].innerHTML = gameCode;
	onPlayerList(playerList);
	updateButtons();
	
	drawCow($("#waitCow")[0]);
	fadeCow();
	animateDots();

	$('#endGameBtn')[0].addEventListener("click", endGame, false);
	$('#quitGameBtn')[0].addEventListener("click", quitGame, false);
	$('#startGameBtn')[0].addEventListener("click", startGame, false);
	$('#addAIBtn')[0].addEventListener("click", addAI, false);

	$("#waitPage").show(1000);
}

function endGame()
{

}

function quitGame()
{

}

function startGame()
{

}

function addAI()
{

}

function updateButtons(numPlayers)
{
	if (loadingScreenType == TypeOfLoadingScreen.PersonWhoStartedTheGame)
	{
		$("#buttons").children().hide();
		$("#endGameBtn").show();
		if (numPlayers < 10)
			$('#addAIBtn').show();
		if (numPlayers >= 2)
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

function onPlayerList(data){
	playerList = data;
	$("#dots").empty();
	$("#playersJoined").empty();
	data.forEach( (playerName) => {
		$("#dots").append("<div></div>");
		$("#playersJoined").append("<li id=\"" + playerName.toLowerCase() + "\" class=\"player\">"+playerName+"</li>");
	});
	updateButtons(data.length);
}
