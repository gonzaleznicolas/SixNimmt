"use strict";

$(function () {
	$('#homeMenuOption').click(() => { window.location.href = "/"; });
	let menuView = new MenuView();
	menuView.showMenuButton();
});
