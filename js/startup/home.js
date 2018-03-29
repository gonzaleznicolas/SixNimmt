"use strict";

$(function () {
		drawCow();
		$('#english')[0].addEventListener("click", onEnglish, false);
		$('#espanol')[0].addEventListener("click", onSpanish, false);
		$('#newGame')[0].addEventListener("click", onNewGame, false);
		$('#vsAI')[0].addEventListener("click", onVsAI, false);
		$('#joinGame')[0].addEventListener("click", onJoinGame, false);
		$('#spectateGame')[0].addEventListener("click", onSpectateGame, false);
});

function onEnglish() {
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
	$('#submit').attr("value", "Submit");

	languageClicked();
}

function onSpanish() {
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
	$('#submit').attr("value", "Enviar");

	languageClicked();
}

function languageClicked() {
	$('#instructionsSection').css("visibility", "visible");
	$('#gameOptionsSection').css("visibility", "visible");
}

function onNewGame() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#newGame').addClass("selected");

		$('#form').children().hide();
		$('#nickName').show();
		$('#submit').show();
		$('#inputSection').css("visibility", "visible");
}

function onVsAI() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#vsAI').addClass("selected");

		$('#form').children().hide();
		$('#inputSection').css("visibility", "hidden");
}

function onJoinGame() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#joinGame').addClass("selected");

		$('#form').children().hide();
		$('#nickName').show();
		$('#submit').show();
		$('#code').show();

		// these 3 lines are temporary to show how to show errors
		$("#nickNameStatus").attr("src", "img/check.png").css("visibility", "visible");
		$("#codeStatus").attr("src", "img/x.png").css("visibility", "visible");
		$("#codeError").show();

		$('#inputSection').css("visibility", "visible");
}

function onSpectateGame() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#spectateGame').addClass("selected");

		$('#form').children().hide();
		$('#code').show();
		$('#submit').show();
		$('#inputSection').css("visibility", "visible");
}

function drawCow()
{
	let canvas = $("#cow")[0];
	let ctx = canvas.getContext("2d");
	BasicShapeDrawer.drawDetailedCowShape(ctx, canvas.width / 2, canvas.height / 2, canvas.width, 0.9 * canvas.height);
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}
