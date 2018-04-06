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

function addAIFromWaitPage()
{
	socket.emit("addAIFromWaitPage");
}

function quitGame()
{
	new Dialog(areYouSureYouWantToLeaveStr,
			leaveStr, 
			function(){
				socket.emit("quitDuringWait");
				location.reload();
			},
			stayStr, undefined);
}

function endGame()
{
	new Dialog(areYouSureYouWantToEndGameStr,
		endGameStr, 
		function(){
			socket.emit("endGame");
			location.reload();
		},
		cancelStr, undefined);
}

function startGame()
{

}