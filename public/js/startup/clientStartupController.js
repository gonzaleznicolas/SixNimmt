"use strict";

const FormType = Object.freeze({ "NewGame": 1, "vsAI": 2, "JoinGame": 3, "SpectateGame": 4 })
const TypeOfLoadingScreen = Object.freeze({"PersonWhoStartedTheGame":1, "PersonJoiningOrSpectator":2})
let formType = undefined;
let socket = undefined;
let loadingScreenType = undefined;
let gameCode = undefined;
let playerList = [];

$(function () {
	startHomePage();
	socket = io();
	socket.on("newGameFormResult", onNewGameFormResult); 
	socket.on("joinGameFormResult", onJoinGameFormResult); 
	socket.on("vsAIFormResult", onVsAIFormResult); 
	socket.on("playerList", onPlayerList); 
});

function onSubmitForm() { 
	if (formType == FormType.NewGame) 
	{ 
		socket.emit('newGame', {nickName: $("#nickNameTextBox").val()}); 
	} 
	else if (formType == FormType.JoinGame) 
	{ 
		socket.emit('joinGame', {gameCode: $("#codeTextBox").val(), nickName: $("#nickNameTextBox").val()}) 
	} 
	else if (formType == FormType.vsAI) 
	{ 
		socket.emit('vsAI', {}) 
	} 
} 
   
function onNewGameFormResult(data) { 
	hideAllErrorStatus(); 
	if (data.valid) 
	{ 
		showNickNameSuccess(); 
		$("#homePage").hide(1000); 
		startWaitPage(data.gameCode, TypeOfLoadingScreen.PersonWhoStartedTheGame, data.firstPlayerName); 
	}
}
   
function onJoinGameFormResult(data) { 
	hideAllErrorStatus(); 
	if (data.codeValid && data.nameValid) 
	{
		showNickNameSuccess(); 
		showCodeSuccess(); 

		$("#homePage").hide(1000); 
		startWaitPage(data.gameCode, TypeOfLoadingScreen.PersonJoiningOrSpectator, data.nickName); 
	} 
	else 
	{ 
		if (!data.nameValid) 
			showNickNameError(); 
		if (!data.codeValid) 
			showCodeError(); 
	} 
} 

function onVsAIFormResult(data) 
{ 
	$("#homePage").hide(1000); 
	$("#gamePage").show(1000); 
} 