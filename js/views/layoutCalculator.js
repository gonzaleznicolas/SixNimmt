"use strict";

class LayoutCalculator
{
	constructor()
	{
		// design parameters defined in main.css body{}
		// dont make these global because where they are now, we are sure that this doesnt execute until the document is loaded.
		// if we make it global, this could execute before the css loads.
		let bodyStyles = window.getComputedStyle(document.body);
		let marginStr = bodyStyles.getPropertyValue('--margin').trim()
		this.margin = parseInt(marginStr.substring(0, marginStr.indexOf("px")).trim());
		
		let radiusStr = bodyStyles.getPropertyValue('--radius').trim()
		this.radius = parseInt(radiusStr.substring(0, radiusStr.indexOf("px")).trim());
		
		this.nimmtPurple = bodyStyles.getPropertyValue('--nimmtPurple').trim();

		// design parameters. change if you want to change how it all looks like
		this.spaceForOneFlickityArrow = 65; // px
		this.cardHeightToWidthFactor = 3/4;
		this.extraNumberOfMarginsBetween6thColAndTheRest = 3;
		this.cowIsThisFractionOfCardHeight = 2/3;
		this.cowIsThisFractionOfCardWidth = 9/10;
		this.cowIsThisPercentDownTheCard = 0.43;
		this.numberIsThisPercentDownTheCard = 0.5;
		this.scoreboardElementHeightToWidthFactor = 4;
		
		// dont change these unless you know what youre doing
		this.numberOfRowsOnTableCanvas = 4;
		this.numberOfColsOnTableCanvasNotIncludingColsForCardsPlayedThisTurn = 6;
		this.numberOfColsOnHandCanvas = 5;
		this.numberOfRowsOnHandCanvas = 2;
		this.percentageOfGalleryHeightLeftForThePlayCardButtonBelowHandCanvas = 0.2;
		
		// calculated depening on game instance
		this.totalNumberOfColsOnTableCanvas = undefined;
		this.additionalColsOnTableCanvasForCardsPlayedThisTurn = undefined;	// depends on the number of players
		this.deFactoSpaceForOneFlickityArrow = undefined;
		
		// calculated layout dimensions
		this.galleryWidth = undefined;
		this.galleryHeight = undefined;
		this.bScoreboardBelowGallery = undefined;
		this.scoreboardWidth = undefined;
		this.scoreboardHeight = undefined;
	}
	
	/************************************************************************************
	Based on the window dimensions, this function will set the following of its own attributes:
		- galleryWidth
		- galleryHeight
		- bScoreboardBelowGallery
		- scoreboardWidth
		- scoreboardHeight
	*************************************************************************************/
	calculate()
	{
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();
		const headerHeight = $('header').height();
		/*******************************************************************************************
		Give the gallery all the space on the screen, see if it wants to take up the full width
		or the full height.
		Note: I didnt really give it the full screen height, I deducted the height of the header
		*******************************************************************************************/
		let galleryDimensions = this.calculateGalleryDimensions(windowWidth, windowHeight - headerHeight)
		
		let galleryWidth = galleryDimensions.width;
		let galleryHeight = galleryDimensions.height;
		let bScoreboardBelowGallery = galleryDimensions.bTookUpFullMaxWidth;
		
		/*******************************************************************************************
		If the screen is such that the gallery took up the full width rather than the full height,
		its a vertical screen and we will put the scoreboard bellow the gallery.
		** but first we have to make sure that the scoreboard+gallery+header fit in the screen,
		or we are not in spectator mode (i.e. scrolling vertically is okay)
		*******************************************************************************************/
		/* CASE 1 : screen vertical alignment: place scoreboard bellow gallery*/
		this.galleryWidth = galleryWidth;
		this.galleryHeight = galleryHeight;
		this.bScoreboardBelowGallery = bScoreboardBelowGallery;
		this.scoreboardWidth = galleryWidth;
		this.scoreboardHeight = this.scoreboardHeightWhenVerticalLayout();
		if (bScoreboardBelowGallery && (this.galleryHeight + this.scoreboardHeight + headerHeight< windowHeight || !bSpectatorMode))
			return;
		
		
		/*******************************************************************************************
		If here, it means the gallery took up the full height of the screen.
		We dont want the width of the gallery + the width of the scoreboard to be wider than the screen,
		we never want horizontal scrolling.
		But we need to make sure the scoreboard is wide enough. Wide enough is defined in this.scoreboardWidthWhenHorizontalLayout()
		So, check if the space left to the right of the gallery is wide enough.
		*******************************************************************************************/
		/* CASE 2 : screen horizontal alignment: place scoreboard beside gallery. There was naturally space for the scoreboard.*/
		this.galleryWidth = galleryWidth;
		this.galleryHeight = galleryHeight;
		this.bScoreboardBelowGallery = false;
		this.scoreboardWidth = this.scoreboardWidthWhenHorizontalLayout();
		this.scoreboardHeight = galleryHeight;
		if (windowWidth - galleryWidth > this.scoreboardWidthWhenHorizontalLayout())
			return;
		
		/*******************************************************************************************
		If here, it means the gallery took up the full height of the screen. We have some space to the side, but
		if we didnt fall into the previous if, its because the space to the side is not enough for the scoreboard.
		If we are not in spectator mode, someone is doing viewing this probably on their phone, so they can scroll down
		to see the scoreboard. Lets put the scoreboard below.
		*******************************************************************************************/
		/* CASE 3 :*/
		this.galleryWidth = galleryWidth;
		this.galleryHeight = galleryHeight;
		this.bScoreboardBelowGallery = true;
		this.scoreboardWidth = galleryWidth;
		this.scoreboardHeight = this.scoreboardHeightWhenVerticalLayout();
		if (!bSpectatorMode)
			return;
		
		/*******************************************************************************************
		If here, we are laying out in horizontal mode, the space left to the right of the gallery
		is not wide enough for the scoreboard, and we are on spectator mode so we wont tolerate any scrolling.
		So the solution is to shrink the gallery so that we have space for the scoreboard.
		So, recalculate the gallery dimensions, and give it as its max width the
		screen width - space needed for scoreboard.
		*******************************************************************************************/
		galleryDimensions = this.calculateGalleryDimensions(windowWidth - this.scoreboardWidthWhenHorizontalLayout(), windowHeight - headerHeight);
		galleryWidth = galleryDimensions.width;
		galleryHeight = galleryDimensions.height;
		
		/* CASE 4 : screen horizontal alignment: place scoreboard beside gallery. Gallery had to be shrunk to fit scoreboard.*/
		this.galleryWidth = galleryWidth;
		this.galleryHeight = galleryHeight;
		this.bScoreboardBelowGallery = false;
		this.scoreboardWidth = this.scoreboardWidthWhenHorizontalLayout();
		this.scoreboardHeight = galleryHeight;
		
		return;
	}
	
	
	/****************************************************************************************************************************************************************
	In order to calculate the dimensions of the gallery, we need to calculate the dimensions of the table canvas.
	Why?
	Because the gallery's dimensions are set to fit its largest cell, which in our case is always the table canvas.
	The other consideration is whether flickity is on or off. If off, deFactoSpaceForOneFlickityArrow==0 and so we dont leave space for arrows
	Note: if flickity is off, the hand will show below the game canvas, and so in reality the gallery height is larger than what we calculate here,
	but even then, we only want the scoreboard to be as tall as the table canvas so there is no need to account for the height of the gallery being different
	when flickity is off.
	
	Explanation of the formulas...?
		The point is to calculate the dimensions of the table canvas based on card dimensions, margins, etc.
		Note: totalNumberOfColsOnTableCanvas = number of cols for the game + number of cols for cards played this turn (depends on number of players)
		
		See the constants cardHeightToWidthFactor, numberOfRowsOnTableCanvas, totalNumberOfColsOnTableCanvas, margin,
		and extraSpaceBetween6thColAndLastCol.
		Those numbers will be set by the the user and the canvas and cards will be layed out acordingly.
		
		The dimensions of the canvas considering the number of cards and the dimensions of the cards can be derived this way:

			cardWidth = cardHeight * cardHeightToWidthFactor
			tableCanvasWidth = (totalNumberOfColsOnTableCanvas * cardWidth) + (totalNumberOfColsOnTableCanvas + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin
			tableCanvasHeight = (numberOfRowsOnTableCanvas * cardHeight) + (numberOfRowsOnTableCanvas + 1)*margin
			
			For this function, we need to use the formulas above to relate tableCanvasWidth and tableCanvasHeight to eachother in terms of the constants.
			(cancel out the unknowns cardWidth and cardHeight)
			
			The result is:
				tableCanvasHeight = ((numberOfRowsOnTableCanvas*
												(tableCanvasWidth - ((totalNumberOfColsOnTableCanvas + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin)))/
												(totalNumberOfColsOnTableCanvas * cardHeightToWidthFactor)) +
												((numberOfRowsOnTableCanvas + 1)*margin)
				tableCanvasWidth = ((totalNumberOfColsOnTableCanvas *
											 cardHeightToWidthFactor * (tableCanvasHeight - ((numberOfRowsOnTableCanvas + 1)*margin)))/
											 numberOfRowsOnTableCanvas) + ((totalNumberOfColsOnTableCanvas + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin)
	****************************************************************************************************************************************************************/
	calculateGalleryDimensions(maxWidth, maxHeight)
	{
		let bTookUpFullMaxWidth = true;
		
		// CASE 1
		let tabletableCanvasWidth = maxWidth - 2*this.deFactoSpaceForOneFlickityArrow;
		let tabletableCanvasHeight = ((this.numberOfRowsOnTableCanvas*
												(tabletableCanvasWidth - ((this.totalNumberOfColsOnTableCanvas + 1 + this.extraNumberOfMarginsBetween6thColAndTheRest)*this.margin)))/
												(this.totalNumberOfColsOnTableCanvas * this.cardHeightToWidthFactor)) +
												((this.numberOfRowsOnTableCanvas + 1)*this.margin);
		
		// if by setting tabletableCanvasWidth = maxWidth - 2*deFactoSpaceForOneFlickityArrow and maintaining the ration we make the canvas taller than the screen
		if (tabletableCanvasHeight > maxHeight)
		{	
				// CASE 2
				tabletableCanvasHeight = maxHeight;
				tabletableCanvasWidth = ((this.totalNumberOfColsOnTableCanvas *
											 this.cardHeightToWidthFactor * (tabletableCanvasHeight - ((this.numberOfRowsOnTableCanvas + 1)*this.margin)))/
											 this.numberOfRowsOnTableCanvas) + ((this.totalNumberOfColsOnTableCanvas + 1 + this.extraNumberOfMarginsBetween6thColAndTheRest)*this.margin);
				bTookUpFullMaxWidth = false;
		}

		return {width: tabletableCanvasWidth + 2*this.deFactoSpaceForOneFlickityArrow, height: tabletableCanvasHeight, bTookUpFullMaxWidth: bTookUpFullMaxWidth};
	}
	
	scoreboardWidthWhenHorizontalLayout()
	{
		let elementHeight = (this.galleryHeight - (maxNumberOfPlayers + 1)*this.margin)/maxNumberOfPlayers;
		let elementWidth = elementHeight*this.scoreboardElementHeightToWidthFactor;
		let scoreboardWidth = elementWidth + 2*this.margin;
		return scoreboardWidth;
	}
	
	scoreboardHeightWhenVerticalLayout()
	{
		let scoreboardElementsPerRow = 4;
		let numberOfRows = Math.ceil(numberOfPlayers/scoreboardElementsPerRow);
		let elementWidth = (this.galleryWidth - (scoreboardElementsPerRow + 1)*this.margin)/scoreboardElementsPerRow;
		let elementHeight = elementWidth * (1/this.scoreboardElementHeightToWidthFactor);
		let scoreboardHeight = numberOfRows*elementHeight + (numberOfRows + 1)*this.margin;
		return scoreboardHeight;
	}
}
