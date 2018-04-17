"use strict";

const closeEnough = 5; //px

class CardMovementLine
{

	constructor(x1, y1, x2, y2, millisecondsToTake)
	{
		this.done = false;
		
		if (Math.abs(x1 - x2) <= closeEnough && Math.abs(y1 - y2) <= closeEnough)
		{
			// if the card is already in its final position, still, set these variables, and return them
			// those coordinates on nextPoint(). This is important for the upcoming card sorting. If a card begins
			// in its final position, we still need to draw it in place every interation in case other cards are passing overtop of it.
			this.done = true;
			this.xySwapped = false;
			this.x2 = x2;
			this.y2 = y2;
			return;
		}
		
		// whichever of x or y has the bigger difference between start and end, gets to be "x",
		// and the other is "y". "x" and "y" in the sense that in traditional math, x is the input
		// and y is the output. I.e. y is a function of x.
		// but if we were to move a card vertically (x1==x2), and we get y's by incrementing x, the card would
		// move in one big jump or we would have other problems. so whichever (between x and y) has the bigger
		// difference from start to end, call it x and increment that gradually and get "y"'s for each of those input "x"'s.
		this.xySwapped = false;
		if (Math.abs(x2 - x1) > Math.abs(y2 - y1))
		{
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;	
		}
		else
		{
			this.x1 = y1;
			this.y1 = x1;
			this.x2 = y2;
			this.y2 = x2;
			this.xySwapped = true;
		}

		// now that we have set x and y according to which has the biggest difference, we can think of everything as in usual math
		
				
		// determine slope	
		this.m = (this.y2 - this.y1)/(this.x2 - this.x1); // slope
		
		this.b = this.y1 - this.x1*this.m; // y intercept

		this._timeToTake = millisecondsToTake;
		this._startTime = Date.now();
		this._endTime = this._startTime + this._timeToTake;
		// determine if we have to add or subtract from x1
		this.xIncrementDirection = this.x2 - this.x1 > 0 ? 1 : -1;
	}
	
	// get y from x
	f(x)
	{
		return this.m*x + this.b;
	}
	
	nextPoint()
	{
		if (this.done)
			return this.xySwapped ? {x: this.y2, y: this.x2} : {x: this.x2, y: this.y2};
		if (Date.now() >= this._endTime)
		{
			this.done = true;
			// return the exact final points to make sure we are not off even by a little bit
			return this.xySwapped ? {x: this.y2, y: this.x2} : {x: this.x2, y: this.y2};
		}
		else
		{
			let fractionOfTimeEllapsed = (Date.now() - this._startTime) / this._timeToTake;
			let correspondingX = this.x1 + this.xIncrementDirection*fractionOfTimeEllapsed*Math.abs(this.x1 - this.x2);
			return this.xySwapped ? {x: this.f(correspondingX), y: correspondingX} : {x: correspondingX, y: this.f(correspondingX)};
		}
	}
}