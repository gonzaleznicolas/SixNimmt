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
	$('#videoInstructions')[0].innerHTML = "Video Instructions";
	$('#textInstructions')[0].innerHTML = "Text Instructions";

	$('#newGame')[0].innerHTML = "New Game";
	$('#vsAI')[0].innerHTML = "1v1 vs Computer";
	$('#joinGame')[0].innerHTML = "Join Game";
	$('#spectateGame')[0].innerHTML = "Spectate Game";

	$('#nickNamePrompt')[0].innerHTML = "Nickname for yourself:";
	$('#codePrompt')[0].innerHTML = "Game code:";

	languageClicked();
}

function onSpanish() {
	$('#videoInstructions')[0].innerHTML = "Video Instrucciones";
	$('#textInstructions')[0].innerHTML = "Instrucciones Escritas";

	$('#newGame')[0].innerHTML = "Iniciar nuevo juego";
	$('#vsAI')[0].innerHTML = "Jugar contra computador";
	$('#joinGame')[0].innerHTML = "Unirse a juego";
	$('#spectateGame')[0].innerHTML = "Ver juego";

	$('#nickNamePrompt')[0].innerHTML = "Tu apodo:";
	$('#codePrompt')[0].innerHTML = "Codigo del juego:";
	languageClicked();
}

function languageClicked() {
	$('#instructionsSection').css("visibility", "visible");
	$('#gameOptionsSection').css("visibility", "visible");
}

function onNewGame() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#newGame').addClass("selected");
		$('#inputSection').children().hide();
		$('#nickName').show();
		$("#nickNameStatus").attr("src", "img/check.png").css("visibility", "visible");
		$('#inputSection').css("visibility", "visible");
}

function onVsAI() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#vsAI').addClass("selected");
		$('#inputSection').children().hide();
}

function onJoinGame() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#joinGame').addClass("selected");
		$("#nickNameStatus").attr("src", "img/check.png").css("visibility", "visible");
		$("#codeStatus").attr("src", "img/x.png").css("visibility", "visible");
		$('#inputSection').children().show();
		$('#inputSection').css("visibility", "visible");
}

function onSpectateGame() {
		$('#gameOptionsSection').children().removeClass("selected");
		$('#spectateGame').addClass("selected");
		$('#inputSection').children().hide();
		$('#code').show();
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
