"use strict";


$(function () {
 drawCow();
 fadeCow();
 animateDots();
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

function fadeCow()
{
 $("#cow").fadeTo(2000, 0.3, function () { $("#cow").fadeTo(2000, 1, fadeCow) })
}


let nextDotIndex = 0;
let animationSpeed = 400;
function animateDots()
{
 nextDotIndex = (nextDotIndex + 1) % $("#dots").children().length;
 $("#dots").children().eq(nextDotIndex).hide(animationSpeed, function () { $("#dots").children().eq(nextDotIndex).show(animationSpeed, animateDots); })
}

function addPlayer()
{
 $("#dots").append("<div></div>");
}
