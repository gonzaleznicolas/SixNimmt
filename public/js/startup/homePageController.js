"use strict";

const FormType = Object.freeze({ "NewGame": 1, "vsAI": 2, "JoinGame": 3, "SpectateGame": 4 })
const TypeOfLoadingScreen = Object.freeze({"PersonWhoStartedTheGame":1, "PersonJoiningOrSpectator":2})
let formType = undefined;
let socket = undefined;
let loadingScreenType = undefined;
let gameCode = undefined;

$(function () {
	startHomePageUI();
	socket = io();

	// SERVER FORM RESULTS
	socket.on("serverNewGameFormResult", onNewGameFormResult);
	socket.on("serverJoinGameFormResult", onJoinGameFormResult);
	socket.on("server1v1vsAIFormResult", onVsAIFormResult);
	socket.on("serverSpectateGameFormResult", onSpectateFormResult);

	// SERVER EVENTS DURING WAIT PAGE
	socket.on("serverPlayerList", onPlayerList);
	socket.on("serverGameTerminated", onServerGameTerminated);
	socket.on("serverStartGame", onServerStartGame);
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
		socket.emit('client1v1vsAI');
	}
	else if (formType == FormType.SpectateGame)
	{
		socket.emit('clientSpectateGame', {gameCode: $("#codeTextBox").val()});
	}
}

// FORM RESULT HANDLERS

function onNewGameFormResult(data) { 
	hideAllErrorStatus(); 
	if (data.valid) 
	{ 
		showNickNameSuccess(); 
		$("#homePage").hide(1000); 
		launchWaitPage(data.gameCode, TypeOfLoadingScreen.PersonWhoStartedTheGame); 
	}
}
   
function onJoinGameFormResult(data) { 
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
	} 
} 

function onVsAIFormResult() 
{ 
	onStartGameClicked();
}

function onSpectateFormResult(data)
{
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
	} 
}

// SERVER EVENT HANDLERS

function onServerGameTerminated(terminatorPlayerName)
{
	new Dialog(thisGameHasBeenTerminatedStr+terminatorPlayerName,
		okStr, 
		function(){
			location.reload();
		});
}

function onServerStartGame(data)
{
	$("#homePage").hide(1000);
	$("#waitPage").hide(1000);
	$("#gamePage").show(1000, function(){
		controller = new GameController(data);
	});
}