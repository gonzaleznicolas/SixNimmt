"use strict";

//replace this with function startWaitPage()
function startWaitPageUI() {
	$("#code")[0].innerHTML = gameCode;
	drawCow($("#waitCow")[0]);
	fadeCow();
	animateDots();
	updatePlayerListAndButtons(waitPagePlayerList);

	$('#endGameBtn')[0].addEventListener("click", onEndGameClicked, false);
	$('#quitGameBtn')[0].addEventListener("click", onQuitGameClicked, false);
	$('#startGameBtn')[0].addEventListener("click", onStartGameClicked, false);
	$('#addAIBtn')[0].addEventListener("click", onAddAIFromWaitPageClicked, false);

	$("#waitPage").show(1000);
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

function updatePlayerList(listOfPlayers)
{
	$("#dots").empty();
	$("#playersJoined").empty();
	listOfPlayers.forEach( (playerName) => {
		$("#dots").append("<div></div>");
		$("#playersJoined").append("<li class=\"player\">"+playerName+"</li>");
	});
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

function updatePlayerListAndButtons(listOfPlayers){
	updatePlayerList(listOfPlayers)
	updateButtons(listOfPlayers.length);
}
