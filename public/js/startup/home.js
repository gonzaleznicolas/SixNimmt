"use strict";

const FormType = Object.freeze({ "NewGame": 1, "vsAI": 2, "JoinGame": 3, "SpectateGame": 4 })
let formType = undefined;

$(function () {
	drawCow($("#homeCow")[0]);
	$('#english')[0].addEventListener("click", onUKClicked, false);
	$('#espanol')[0].addEventListener("click", onSpainClicked, false);
	$('#newGame')[0].addEventListener("click", onNewGame, false);
	$('#vsAI')[0].addEventListener("click", onVsAI, false);
	$('#joinGame')[0].addEventListener("click", onJoinGame, false);
	$('#spectateGame')[0].addEventListener("click", onSpectateGame, false);
	$('#submitButton')[0].addEventListener("click", onSubmitForm, false);
});

function onUKClicked() {
	translateToEnglish();
	languageClicked();
}

function onSpainClicked() {
	translateToSpanish();
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
	$('#nickNameFormSection').show();
	$('#submitButton').show();
	$('#inputSection').css("visibility", "visible");
	formType = FormType.NewGame;
}

function onVsAI() {
	$('#gameOptionsSection').children().removeClass("selected");
	$('#vsAI').addClass("selected");

	$('#form').children().hide();
	$('#inputSection').css("visibility", "hidden");
	formType = FormType.vsAI;
}

function onJoinGame() {
	$('#gameOptionsSection').children().removeClass("selected");
	$('#joinGame').addClass("selected");

	$('#form').children().hide();
	$('#nickNameFormSection').show();
	$('#submitButton').show();
	$('#codeFormSection').show();

	// these 3 lines are temporary to show how to show errors
	$("#nickNameStatus").attr("src", "img/check.png").css("visibility", "visible");
	$("#codeStatus").attr("src", "img/x.png").css("visibility", "visible");
	$("#codeError").show();

	$('#inputSection').css("visibility", "visible");
	formType = FormType.JoinGame;
}

function onSpectateGame() {
	$('#gameOptionsSection').children().removeClass("selected");
	$('#spectateGame').addClass("selected");

	$('#form').children().hide();
	$('#codeFormSection').show();
	$('#submitButton').show();
	$('#inputSection').css("visibility", "visible");
	formType = FormType.SpectateGame;
}

function onSubmitForm() {
	let socket = io();
	if (formType == FormType.NewGame)
	{
		socket.emit('newGame', {nickName: $("#nickNameTextBox").val()});
	}
}

function drawCow(canvas)
{
	let ctx = canvas.getContext("2d");
	BasicShapeDrawer.drawDetailedCowShape(ctx, canvas.width / 2, canvas.height / 2, canvas.width, 0.9 * canvas.height);
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}
