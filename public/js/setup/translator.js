"use strict";

let bSpanish = false;

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

function translateToEnglish()
{
	bSpanish = false;
	
	// home
	$('#howToPlay')[0].innerHTML = "How to Play";
	$('#howToPlay').attr("href", "howToPlayEn.html");
	$('#about')[0].innerHTML = "About";
	$('#about').attr("href", "aboutEn.html");

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

function translateToSpanish()
{
	bSpanish = true;
	
	// home
	$('#howToPlay')[0].innerHTML = "Cómo Jugar";
	$('#howToPlay').attr("href", "howToPlayEs.html");
	$('#about')[0].innerHTML = "Acerca De...";
	$('#about').attr("href", "aboutEs.html");

	$('#newGame')[0].innerHTML = "Iniciar juego nuevo";
	$('#vsAI')[0].innerHTML = "Jugar contra computador";
	$('#joinGame')[0].innerHTML = "Unirse a juego";
	$('#spectateGame')[0].innerHTML = "Ver juego";

	$('#nickNamePrompt')[0].innerHTML = "Tu apodo:";
	$('#codePrompt')[0].innerHTML = "Código del juego:";

	$('#nickNameError')[0].innerHTML = "Ese apodo no esta disponible o es invalido.<br>Elige un apodo alfanumerico con 1-6 caracteres.";
	$('#codeError')[0].innerHTML = "Ese codigo no corresponde a un juego activo.";

	$('#nickNameTextBox').attr("placeholder", "max 6 caracteres");
	$('#codeTextBox').attr("placeholder", "codigo de 4 digitos");
	$('#submitButton')[0].innerHTML = "Enviar";
	
	// wait
	$('#theCodeIs')[0].innerHTML = "El código del juego es";
	$('#playerAllowance')[0].innerHTML = "2-10 jugadores permitidos";
	$('#endGameBtn')[0].innerHTML = "Terminar juego";
	$('#quitGameBtn')[0].innerHTML = "Salir";
	$('#startGameBtn')[0].innerHTML = "Comenzar con estos jugadores";
	$("#needMorePlayers")[0].innerHTML = "Se necesitan más jugadores";
	$('#addAIBtn')[0].innerHTML = "Agregar jugador artificial";
	
	// game
	$('#playCardButton')[0].innerHTML = "Poner Carta";
	$('#selectCardMessage')[0].innerHTML = "Por favor elige una carta";
	$('#notTimeToPlayCardMessage')[0].innerHTML = "No es hora de elegir una carta";

	// menu
	$('#quitMenuOption')[0].innerHTML = "Terminar Juego";

	areYouSureYouWantToLeaveStr = "Seguro que quires salir?";
	leaveStr = "Salirme";
	stayStr = "Quedarme";

	areYouSureYouWantToEndGameStr = "Seguro que quieres terminar este juego para todos los conectados?";
	endGameStr = "Terminar juego";
	cancelStr = "Cancelar";

	thisGameHasBeenTerminatedStr = "Este juego ha sido terminado por ";

	selectARowStr = "Elige una fila para llevarte";
	selectRowStr = "elegir fila";
	waitingForStr = "Esperando a que";
	toPickARowStr = "elija una fila";

	selectedRowStr = "eligió la fila";

	selectACardToPlayStr = "Por favor elige una carta";

	waitingForOthersToFinishDisplayingRoundStr = "Esperando a que todos terminen de mostrar la ronda";

	doYouWantToRewatchRoundStr = 'Quieres repetir esta ronda? (tienes 10 segundos para responder)';
	rewatchStr = 'Repetir';
	continueStr = 'Continuar';

	someoneWantedToRewatchStr = 'Alguien quizo repetir el turno';

	dontShowDialogStr = "No me vuelvas a preguntar";

	gameOverStr = "El juego ha terminado (alguien alcanzo 66 puntos)! ";
	theWinnerIsStr = "El ganador es ";
	theWinnersAreStr = "Los ganadores son ";
	gameOverHeaderStr = "El juego ha terminado!";

	youGotKickedOutStr = "Te demoraste demasiado en responder y te han sacado del juego.";

	initialInstructionsStr = "Durante el juego, por favor no minimizes esta ventana o abras otras ventanas. Puedes perder conexión al servidor";
}