$(function () {
	const sixNimmtModel = new SixNimmtModel();
	const sixNimmtView = new SixNimmtView(sixNimmtModel);
	
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(25, 25, 10, 0, Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	
	var canvas = document.getElementById("handCanvas");
	var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(55, 55, 50, 0, Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
});