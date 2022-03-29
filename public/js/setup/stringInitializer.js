"use strict";

// strings
let areYouSureYouWantToLeaveStr;
let leaveStr;
let stayStr;
let areYouSureYouWantToEndGameStr;
let endGameStr;
let cancelStr;
let thisGameHasBeenTerminatedStr;
let okStr = "OK";
let selectARowStr;
let selectRowStr;
let waitingForStr;
let toPickARowStr;
let selectedRowStr;
let selectACardToPlayStr;
let waitingForOthersToFinishDisplayingRoundStr;
let doYouWantToRewatchRoundStr;
let rewatchStr;
let continueStr;
let someoneWantedToRewatchStr;
let dontShowDialogStr;
let gameOverStr;
let theWinnerIsStr;
let theWinnersAreStr;
let gameOverHeaderStr;
let youGotKickedOutStr;
let initialInstructionsStr;

function initStrings()
{	
	// home
	$('#howToPlay')[0].innerHTML = "How to Play";
	$('#about')[0].innerHTML = "About";

	$('#newGame')[0].innerHTML = "New Game";
	$('#vsAI')[0].innerHTML = "1v1 vs Computer";
	$('#joinGame')[0].innerHTML = "Join Game";
	$('#spectateGame')[0].innerHTML = "Spectate Game";

	$('#nickNamePrompt')[0].innerHTML = "Nickname for yourself:";
	$('#codePrompt')[0].innerHTML = "Game code:";

	$('#nickNameError')[0].innerHTML = "That nickname is taken or invalid.<br>Choose alphanumeric name with 1-6 characters.";
	$('#codeError')[0].innerHTML = "That code does not identify an open game. Try again.";

	$('#nickNameTextBox').attr("placeholder", "max 6 characters");
	$('#codeTextBox').attr("placeholder", "4 digit code");
	$('#submitButton')[0].innerHTML = "Submit";

	// wait
	$('#theCodeIs')[0].innerHTML = "The game code is";
	$('#playerAllowance')[0].innerHTML = "2-10 players allowed";
	$('#endGameBtn')[0].innerHTML = "End game";
	$('#quitGameBtn')[0].innerHTML = "Quit game";
	$('#startGameBtn')[0].innerHTML = "Start with current players";
	$("#needMorePlayers")[0].innerHTML = "Need more players";
	$('#addAIBtn')[0].innerHTML = "Add artificial player";
	
	// game
	$('#playCardButton')[0].innerHTML = "Play Card";
	$('#selectCardMessage')[0].innerHTML = "Please select a card to play";
	$('#notTimeToPlayCardMessage')[0].innerHTML = "It is not time to play a card";

	// menu
	$('#quitMenuOption')[0].innerHTML = "Quit Game";

	areYouSureYouWantToLeaveStr = "Are you sure you want to leave this game?";
	leaveStr = "Leave";
	stayStr = "Stay";

	areYouSureYouWantToEndGameStr = "Are you sure you want to end this game for everyone connected?";
	endGameStr = "End game";
	cancelStr = "Cancel";

	thisGameHasBeenTerminatedStr = "This game has been terminated by ";

	selectARowStr = "Select a row to take";
	selectRowStr = "Select Row";
	waitingForStr = "Waiting for";
	toPickARowStr = "to pick a row to take";

	selectedRowStr = "selected row";

	selectACardToPlayStr = "Please select a card to play";

	waitingForOthersToFinishDisplayingRoundStr = "Waiting for others to finish displaying round";

	doYouWantToRewatchRoundStr = 'Do you want to rewatch this round? (you have 10 seconds to respond)';
	rewatchStr = 'Rewatch';
	continueStr = 'Continue';

	someoneWantedToRewatchStr = "Someone asked to watch round replay";

	dontShowDialogStr = "Do not continue to show this dialog";

	gameOverStr = "Game Over (someone reached 66 points)! ";
	theWinnerIsStr = "The winner is ";
	theWinnersAreStr = "The winners are ";
	gameOverHeaderStr = "Game over!";

	youGotKickedOutStr = "You took too long to respond and have been kicked out of the game.";

	initialInstructionsStr = "For the duration of this game, please do not minimize this tab or switch to other tabs. You may lose connection to the server and be kicked out of the game.";
}
