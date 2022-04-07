"use strict";

$(function () {
	$('#homeMenuOption').click(() => { window.location.href = "/"; });
	$('#aboutMenuOption').click(() => { window.location.href = "/about"; });
	$('#howToPlayMenuOption').click(() => { window.location.href = "/howToPlay"; });
	$('#gameLogMenuOption').click(() => { window.location.href = "/gameLog"; });
	let menuView = new MenuView();
	menuView.showMenuButton();
});
