"use strict";

function startHomePageUI(){
	drawCow($("#homeCow")[0]);
	$('#english')[0].addEventListener("click", onUKClicked, false);
	$('#espanol')[0].addEventListener("click", onSpainClicked, false);
	$('#newGame')[0].addEventListener("click", onNewGameClicked, false);
	$('#vsAI')[0].addEventListener("click", onVsAIClicked, false);
	$('#joinGame')[0].addEventListener("click", onJoinGameClicked, false);
	$('#spectateGame')[0].addEventListener("click", onSpectateGameClicked, false);
	$('#submitButton')[0].addEventListener("click", onSubmitFormClicked, false);
}

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

function onNewGameClicked() {
	hideAllErrorStatus();
	$('#gameOptionsSection').children().removeClass("selected");
	$('#newGame').addClass("selected");

	$('#form').children().hide();
	$('#nickNameFormSection').show();
	$('#submitButton').show();
	$('#inputSection').css("visibility", "visible");
	formType = FormType.NewGame;
}

function onVsAIClicked() {
	hideAllErrorStatus();
	$('#gameOptionsSection').children().removeClass("selected");
	$('#vsAI').addClass("selected");

	$('#form').children().hide();
	$('#inputSection').css("visibility", "hidden");
	formType = FormType.vsAI;
	onSubmitForm();
}

function onJoinGameClicked() {
	hideAllErrorStatus();
	$('#gameOptionsSection').children().removeClass("selected");
	$('#joinGame').addClass("selected");

	$('#form').children().hide();
	$('#nickNameFormSection').show();
	$('#submitButton').show();
	$('#codeFormSection').show();

	$('#inputSection').css("visibility", "visible");
	formType = FormType.JoinGame;
}

function onSpectateGameClicked() {
	hideAllErrorStatus();
	$('#gameOptionsSection').children().removeClass("selected");
	$('#spectateGame').addClass("selected");

	$('#form').children().hide();
	$('#codeFormSection').show();
	$('#submitButton').show();
	$('#inputSection').css("visibility", "visible");
	formType = FormType.SpectateGame;
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

function hideAllErrorStatus()
{
	$("#nickNameStatus").css("visibility", "hidden");
	$("#nickNameError").hide();
	$("#codeStatus").css("visibility", "hidden");
	$("#codeError").hide();
}

function showNickNameError()
{
	$("#nickNameStatus").attr("src", "img/x.png").css("visibility", "visible");
	$("#nickNameError").show();
}

function showCodeError()
{
	$("#codeStatus").attr("src", "img/x.png").css("visibility", "visible");
	$("#codeError").show();
}

function showNickNameSuccess()
{
	$("#nickNameStatus").attr("src", "img/check.png").css("visibility", "visible");
	$("#nickNameError").hide();
}

function showCodeSuccess()
{
	$("#codeStatus").attr("src", "img/check.png").css("visibility", "visible");
	$("#codeError").hide();
}