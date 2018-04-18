"use strict";

const FormType = Object.freeze({ NewGame: 1, vsAI: 2, JoinGame: 3, SpectateGame: 4 });
const TypeOfLoadingScreen = Object.freeze({PersonWhoStartedTheGame:1, PersonJoiningOrSpectator:2});

let formType = undefined;
let socket = undefined;
let loadingScreenType = undefined;
let gameCode = undefined;
let waitPagePlayerList = [];
let state = undefined;


$(function () {
	state = ClientStates.NotPastFormYet;
	startHomePageUI();
	socket = io();

	// SERVER TO CLIENT - FORM RESULT EVENTS
	socket.on("serverNewGameFormResult", onNewGameFormResult);
	socket.on("serverJoinGameFormResult", onJoinGameFormResult);
	socket.on("server1v1vsAIFormResult", onVsAIFormResult);
	socket.on("serverSpectateGameFormResult", onSpectateFormResult);

	// SERVER TO CLIENT - WAIT PAGE EVENTS
	socket.on("serverPlayerList", onServerPlayerList);
	socket.on("serverStartGame", onServerStartGame);

	// SERVER TO CLIENT - GAME EVENTS
	socket.on("serverGameTerminated", onServerGameTerminated);
});

function onSubmitFormClicked() { 
	if (formType == FormType.NewGame) 
	{ 
		socket.emit('clientNewGame', {nickName: $("#nickNameTextBox").val()}); 
	} 
	else if (formType == FormType.JoinGame) 
	{ 
		socket.emit('clientJoinGame', {gameCode: $("#codeTextBox").val(), nickName: $("#nickNameTextBox").val()});
	} 
	else if (formType == FormType.vsAI) 
	{ 
		socket.emit('client1v1vsAI', {nickName: $("#nickNameTextBox").val()});
	}
	else if (formType == FormType.SpectateGame)
	{
		socket.emit('clientSpectateGame', {gameCode: $("#codeTextBox").val()});
	}
	state = ClientStates.WaitingForFormResult;
}

// SERVER TO CLIENT - FORM RESULT HANDLERS

function onNewGameFormResult(data) { 
	if (state != ClientStates.WaitingForFormResult)
	{
		console.log("serverNewGameFormResult received at unexpected time. Ignored.");
		return;
	}
	hideAllErrorStatus(); 
	if (data.nameValid) 
	{ 
		showNickNameSuccess(); 
		$("#homePage").hide(1000); 
		launchWaitPage(data.gameCode, TypeOfLoadingScreen.PersonWhoStartedTheGame); 
	}
	else 
	{ 
		showNickNameError();
		state = ClientStates.NotPastFormYet;
	}
}
   
function onJoinGameFormResult(data) {
	if (state != ClientStates.WaitingForFormResult)
	{
		console.log("serverJoinGameFormResult received at unexpected time. Ignored.");
		return;
	}
	hideAllErrorStatus(); 
	if (data.codeValid && data.nameValid) 
	{
		showNickNameSuccess(); 
		showCodeSuccess(); 

		$("#homePage").hide(1000); 
		launchWaitPage(data.gameCode, TypeOfLoadingScreen.PersonJoiningOrSpectator); 
	} 
	else 
	{ 
		if (!data.nameValid) 
			showNickNameError(); 
		if (!data.codeValid) 
			showCodeError(); 
		state = ClientStates.NotPastFormYet;
	} 
} 

function onVsAIFormResult(data) 
{
	if (state != ClientStates.WaitingForFormResult)
	{
		console.log("server1v1vsAIFormResult received at unexpected time. Ignored.");
		return;
	}

	hideAllErrorStatus(); 
	if (data.nameValid) 
	{ 
		showNickNameSuccess(); 
		$("#homePage").hide(1000); 
		onStartGameClicked();
		state = ClientStates.WaitPage;
	}
	else 
	{ 
		showNickNameError();
		state = ClientStates.NotPastFormYet;
	}
}

function onSpectateFormResult(data)
{
	if (state != ClientStates.WaitingForFormResult)
	{
		console.log("serverSpectateGameFormResult received at unexpected time. Ignored.");
		return;
	}
	hideAllErrorStatus(); 
	if (data.codeValid) 
	{
		showCodeSuccess(); 

		$("#homePage").hide(1000); 
		launchWaitPage(data.gameCode, TypeOfLoadingScreen.PersonJoiningOrSpectator); 
	} 
	else 
	{ 
		showCodeError();
		state = ClientStates.NotPastFormYet;
	} 
}

// SERVER TO CLIENT - WAIT PAGE EVENT HANDLERS
function onServerStartGame(data)
{
	if (state != ClientStates.WaitPage)
	{
		console.log("serverStartGame message received at unexpected time. Ignored.");
		return;
	}
	$("#homePage").hide(1000);
	$("#waitPage").hide(1000);
	$("#gamePage").show(1000, function(){
		controller = new GameController(data);
	});
}

function onServerPlayerList(listOfPlayers){
	// the first player list arrives before the form result does, so accept this message if in state WaitingForFormResult
	if (state != ClientStates.WaitPage && state != ClientStates.WaitingForFormResult)
	{
		console.log("serverPlayerList message received at unexpected time. Ignored.");
		return;
	}
	waitPagePlayerList = listOfPlayers;
	updatePlayerListAndButtons(listOfPlayers);
}

// SERVER TO CLIENT - GAME EVENT HANDLERS

function onServerGameTerminated(terminatorPlayerName)
{
	socket.close();
	new Dialog(thisGameHasBeenTerminatedStr+terminatorPlayerName,
		okStr, 
		function(){
			location.reload();
		});
}