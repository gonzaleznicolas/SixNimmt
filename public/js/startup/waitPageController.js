"use strict";

function launchWaitPage(gc, lst){
	gameCode = gc;
	loadingScreenType = lst;
	startWaitPageUI();
}

function onPlayerList(data){
	playerList = data;
	updatePlayerListAndButtons(data);
}

function onAddAIFromWaitPageClicked()
{
	socket.emit("clientAddAIFromWaitPage");
}

function onQuitGameClicked()
{
	new Dialog(areYouSureYouWantToLeaveStr,
			leaveStr, 
			function(){
				socket.emit("quitDuringWait");
				location.reload();
			},
			stayStr, undefined);
}

function onEndGameClicked()
{
	new Dialog(areYouSureYouWantToEndGameStr,
		endGameStr, 
		function(){
			socket.emit("endGame");
			location.reload();
		},
		cancelStr, undefined);
}

function onStartGameClicked()
{
	socket.emit("startGame");
}