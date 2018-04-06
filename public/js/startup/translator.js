"use strict";

let bSpanish = false;

let areYouSureYouWantToLeave;
let leave;
let stay;

function translateToEnglish()
{
	bSpanish = false;
	
	// home
	$('#videoRules')[0].innerHTML = "Video Rules";
	$('#textRules')[0].innerHTML = "Text Rules";

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
	$('#textRulesMenuOption')[0].innerHTML = "Text Rules";
	$('#videoRulesMenuOption')[0].innerHTML = "Video Rules";

	areYouSureYouWantToLeave = "Are you sure you want to leave this game?";
	leave = "Leave";
	stay = "Stay";
}

function translateToSpanish()
{
	bSpanish = true;
	
	// home
	$('#videoRules')[0].innerHTML = "Reglas en video";
	$('#textRules')[0].innerHTML = "Reglas escritas";

	$('#newGame')[0].innerHTML = "Iniciar nuevo juego";
	$('#vsAI')[0].innerHTML = "Jugar contra computador";
	$('#joinGame')[0].innerHTML = "Unirse a juego";
	$('#spectateGame')[0].innerHTML = "Ver juego";

	$('#nickNamePrompt')[0].innerHTML = "Tu apodo:";
	$('#codePrompt')[0].innerHTML = "Codigo del juego:";

	$('#nickNameError')[0].innerHTML = "Ese apodo no esta disponible o es invalido.<br>Elige un apodo alfanumerico con 1-6 caracteres.";
	$('#codeError')[0].innerHTML = "Ese codigo no corresponde a un juego activo.";

	$('#nickNameTextBox').attr("placeholder", "max 6 caracteres");
	$('#codeTextBox').attr("placeholder", "codigo de 4 digitos");
	$('#submitButton')[0].innerHTML = "Enviar";
	
	// wait
	$('#theCodeIs')[0].innerHTML = "El codigo del juego es";
	$('#playerAllowance')[0].innerHTML = "2-10 jugadores permitidos";
	$('#endGameBtn')[0].innerHTML = "Terminar juego";
	$('#quitGameBtn')[0].innerHTML = "Salir";
	$('#startGameBtn')[0].innerHTML = "Comenzar con estos jugadores";
	$("#needMorePlayers")[0].innerHTML = "Se necesitan mas jugadores";
	$('#addAIBtn')[0].innerHTML = "Agregar jugador artificial";
	
	// game
	$('#playCardButton')[0].innerHTML = "Poner Carta";
	$('#selectCardMessage')[0].innerHTML = "For favor elige una carta";
	$('#notTimeToPlayCardMessage')[0].innerHTML = "No es hora de elejir una carta";

	// menu
	$('#quitMenuOption')[0].innerHTML = "Terminar Juego";
	$('#textRulesMenuOption')[0].innerHTML = "Reglas escritas";
	$('#videoRulesMenuOption')[0].innerHTML = "Reglas en video";

	areYouSureYouWantToLeave = "Seguro que quires salir?";
	leave = "Salirme";
	stay = "Quedarme";
}