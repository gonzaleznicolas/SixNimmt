function drawCardShape(ctx, x, y, width, height, radius)
{
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.arcTo(x, y + height, x + radius, y + height, radius);
		ctx.lineTo(x + width - radius, y + height);
		ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
		ctx.lineTo(x + width, y + radius);
		ctx.arcTo(x + width, y, x + width - radius, y, radius);
		ctx.lineTo(x + radius, y);
		ctx.arcTo(x, y, x, y + radius, radius);
}

function drawDetailedCowShape(ctx, centreX, centreY, cowWidth, cowHeight)
{
		const designConstH = 9;	// dont change
		const designConstW = 10	// dont change
		
		const oneXunit = (1/designConstW)*cowWidth;	// one horizontal unit
		const oneYunit = (1/designConstH)*cowHeight;	// one vertical unit
		
		ctx.beginPath();
		ctx.moveTo(centreX + 5*oneXunit, centreY - 1.8*oneYunit);
		ctx.bezierCurveTo( centreX + 4.5*oneXunit, centreY - 2.6*oneYunit, centreX + 4*oneXunit, centreY - 3.6*oneYunit, centreX + 2.7*oneXunit, centreY - 5*oneYunit);
		ctx.quadraticCurveTo(centreX + 3.1*oneXunit, centreY - 4*oneYunit, centreX + 3*oneXunit, centreY - 2.7*oneYunit);
		ctx.lineTo(centreX + 1.5*oneXunit, centreY - 2.5*oneYunit);
		ctx.lineTo(centreX + 2*oneXunit, centreY - 3*oneYunit);
		ctx.lineTo(centreX + 1.5*oneXunit, centreY - 4.5*oneYunit);
		ctx.lineTo(centreX + 0.5*oneXunit, centreY - 3.5*oneYunit);
		ctx.lineTo(centreX + 1*oneXunit, centreY - 2.5*oneYunit);
		ctx.lineTo(centreX + 0, centreY - 3*oneYunit);
		ctx.lineTo(centreX - 1*oneXunit, centreY - 2.5*oneYunit);
		ctx.lineTo(centreX - 0.5*oneXunit, centreY - 3.5*oneYunit);
		ctx.lineTo(centreX - 1.5*oneXunit, centreY - 4.5*oneYunit);
		ctx.lineTo(centreX - 2*oneXunit, centreY - 3*oneYunit);
		ctx.lineTo(centreX - 1.5*oneXunit, centreY - 2.5*oneYunit);
		ctx.lineTo(centreX - 3*oneXunit, centreY - 2.7*oneYunit);
		ctx.quadraticCurveTo(centreX - 3.1*oneXunit, centreY - 4*oneYunit, centreX - 2.7*oneXunit, centreY - 5*oneYunit);
		ctx.bezierCurveTo(centreX - 4*oneXunit, centreY - 3.6*oneYunit, centreX - 4.5*oneXunit, centreY - 2.6*oneYunit, centreX - 5*oneXunit, centreY - 1.8*oneYunit);
		ctx.quadraticCurveTo(centreX - 4.4*oneXunit, centreY - 1.2*oneYunit,centreX - 2.7*oneXunit, centreY - 0.9*oneYunit);
		ctx.lineTo(centreX - 3*oneXunit, centreY + 0.5*oneYunit);
		ctx.lineTo(centreX - 2*oneXunit, centreY + 1.5*oneYunit);
		ctx.lineTo(centreX - 2.8*oneXunit, centreY + 2.1*oneYunit);
		ctx.lineTo(centreX - 2.2*oneXunit, centreY + 3.5*oneYunit);
		ctx.lineTo(centreX - 1.3*oneXunit, centreY + 3.3*oneYunit);
		ctx.lineTo(centreX - 1*oneXunit, centreY + 4.5*oneYunit);
		ctx.lineTo(centreX + 1*oneXunit, centreY + 4.5*oneYunit);
		ctx.lineTo(centreX + 1*oneXunit, centreY + 4.5*oneYunit);
		ctx.lineTo(centreX + 1.3*oneXunit, centreY + 3.3*oneYunit);
		ctx.lineTo(centreX + 2.2*oneXunit, centreY + 3.5*oneYunit);
		ctx.lineTo(centreX + 2.8*oneXunit, centreY + 2.1*oneYunit);
		ctx.lineTo(centreX + 2*oneXunit, centreY + 1.5*oneYunit);
		ctx.lineTo(centreX + 3*oneXunit, centreY + 0.5*oneYunit);
		ctx.lineTo(centreX + 2.7*oneXunit, centreY - 0.9*oneYunit);
		ctx.quadraticCurveTo(centreX + 4.4*oneXunit, centreY - 1.2*oneYunit,centreX + 5*oneXunit, centreY - 1.8*oneYunit);

}