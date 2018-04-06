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
	new Dialog(areYouSureYouWantToLeave,
			leave, stay, 
			function(){
				socket.emit("quitDuringWait");
				location.reload();
			},
			undefined);
}

function endGame()
{

}

function startGame()
{

}