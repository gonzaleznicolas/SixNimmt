"use strict";

$(function () {
		let canvas = $("#c")[0];
		let ctx = canvas.getContext("2d");
		BasicShapeDrawer.drawDetailedCowShape(ctx, 16, 16, 30, 30);
		ctx.fillStyle = 'rgba(127, 80, 147, 1)';
		ctx.fill();
		ctx.closePath();
});