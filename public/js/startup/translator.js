"use strict";

let bSpanish = false;

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

	$('#nickNameError')[0].innerHTML = "That nickname is taken by someone in the game you are trying to join. Try again.";
	$('#codeError')[0].innerHTML = "That code does not identify an open game. Try again.";

	$('#nickNameTextBox').attr("placeholder", "max 6 characters");
	$('#codeTextBox').attr("placeholder", "4 digit code");
	$('#submitButton').attr("value", "Submit");

	// wait
	
	
	// game
	$('#quitMenuOption')[0].innerHTML = "Quit Game";
	$('#textRules')[0].innerHTML = "Text Rules";
	$('#videoRules')[0].innerHTML = "Video Rules";

	$('#playCardButton')[0].innerHTML = "Play Card";
	$('#selectCardMessage')[0].innerHTML = "Please select a card to play";
	$('#notTimeToPlayCardMessage')[0].innerHTML = "It is not time to play a card";
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

	$('#nickNameError')[0].innerHTML = "Ese apodo esta ocupado. Intenta otro.";
	$('#codeError')[0].innerHTML = "Ese codigo no corresponde a un juego activo.";

	$('#nickNameTextBox').attr("placeholder", "max 6 caracteres");
	$('#codeTextBox').attr("placeholder", "codigo de 4 digitos");
	$('#submitButton').attr("value", "Enviar");
	
	// wait
	
	
	// game
	$('#quitMenuOption')[0].innerHTML = "Terminar Juego";
	$('#textRules')[0].innerHTML = "Reglas escritas";
	$('#videoRules')[0].innerHTML = "Reglas en video";

	$('#playCardButton')[0].innerHTML = "Poner Carta";
	$('#selectCardMessage')[0].innerHTML = "For favor elige una carta";
	$('#notTimeToPlayCardMessage')[0].innerHTML = "No es hora de elejir una carta";
}