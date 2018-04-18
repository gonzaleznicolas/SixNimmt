"use strict";

function launchWaitPage(gc, lst){
	state = ClientStates.WaitPage;
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
	dialog.set(areYouSureYouWantToLeaveStr,
			leaveStr, 
			function(){
				socket.emit("clientQuitGame");
				location.reload();
			},
			stayStr, undefined);
}

function onEndGameClicked()
{
	dialog.set(areYouSureYouWantToEndGameStr,
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
