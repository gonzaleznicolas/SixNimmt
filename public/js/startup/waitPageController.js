"use strict";

function launchWaitPage(gc, lst){
	gameCode = gc;
	loadingScreenType = lst;
	startWaitPageUI();
}

// WAIT PAGE BUTTON CLICK HANDLERS

function onAddAIFromWaitPageClicked()
{
	socket.emit("clientAddAIFromWaitPage");
}

function onQuitGameClicked()
{
	new Dialog(areYouSureYouWantToLeaveStr,
			leaveStr, 
			function(){
				socket.emit("clientQuitGameFromWaitPage");
				location.reload();
			},
			stayStr, undefined);
}

function onEndGameClicked()
{
	new Dialog(areYouSureYouWantToEndGameStr,
		endGameStr, 
		function(){
			socket.emit("clientEndGameFromWaitPage");
			location.reload();
		},
		cancelStr, undefined);
}

function onStartGameClicked()
{
	socket.emit("clientStartGameWithCurrentPlayers");
}

// SERVER EVENT HANDLERS

function onPlayerList(listOfPlayers){
	updatePlayerListAndButtons(listOfPlayers);
}