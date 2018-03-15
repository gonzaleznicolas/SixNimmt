"use strict";

$(function () {
		drawCow();
});

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