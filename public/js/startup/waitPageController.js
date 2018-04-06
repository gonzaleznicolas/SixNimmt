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
	socket.emit("quitDuringWait");
	location.reload();
}

function endGame()
{

}

function startGame()
{

}