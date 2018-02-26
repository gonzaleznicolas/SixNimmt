"use strict";

class LayoutCalculator
{
	/************************************************************************************
	Based on the window dimensions, this function will return an object with the following
	members:
		- galleryWidth
		- galleryHeight
		- bScoreboardBelowGallery
		- scoreboardWidth
		- scoreboardHeight
	*************************************************************************************/
	static calculate()
	{
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();
		const headerHeight = $('header').height();
		/*******************************************************************************************
		Give the gallery all the space on the screen, see if it wants to take up the full width
		or the full height.
		Note: I didnt really give it the full screen height, I deducted the height of the header
		*******************************************************************************************/
		let galleryDimensions = LayoutCalculator.calculateGalleryDimensions(windowWidth, windowHeight - headerHeight)
		
		let galleryWidth = galleryDimensions.width;
		let galleryHeight = galleryDimensions.height;
		let bScoreboardBelowGallery = galleryDimensions.bTookUpFullMaxWidth;
		
		/*******************************************************************************************
		If the screen is such that the gallery took up the full width rather than the full height,
		its a vertical screen and we will put the scoreboard bellow the gallery
		*******************************************************************************************/
		if (bScoreboardBelowGallery)
		{
			/* CASE 1 : screen vertical alignment: place scoreboard bellow gallery*/
			return {galleryWidth: galleryWidth,
					galleryHeight: galleryHeight,
					bScoreboardBelowGallery: true,
					scoreboardWidth: galleryWidth,
					scoreboardHeight: 1000};
		}
		
		/*******************************************************************************************
		If here, it means the gallery took up the full height of the screen.
		We dont want the width of the gallery + the width of the scoreboard to be wider that the screen,
		we never want horizontal scrolling.
		But we need to make sure the scoreboard is wide enough. Wide enough is defined in LayoutCalculator.scoreboardWidthWhenHorizontalLayout()
		So, check if the space left to the right of the gallery is wide enough.
		*******************************************************************************************/
		if (windowWidth - galleryWidth > LayoutCalculator.scoreboardWidthWhenHorizontalLayout(galleryHeight))
		{
			/* CASE 2 : screen horizontal alignment: place scoreboard beside gallery. There was naturally space for the scoreboard.*/
			return {galleryWidth: galleryWidth, galleryHeight: galleryHeight,
					bScoreboardBelowGallery: false,
					scoreboardWidth: LayoutCalculator.scoreboardWidthWhenHorizontalLayout(galleryHeight),
					scoreboardHeight: galleryHeight};
		}
		
		/*******************************************************************************************
		If here, it means the gallery took up the full height of the screen. We have some space to the side, but
		if we didnt fall into the previous if, its because the space to the side is not enought for the scoreboard.
		If we are not in spectator mode, someone is doing viewing this probably on their phone, so they can scroll down
		to see the scoreboard. Lets put the scoreboard below.
		*******************************************************************************************/
		if (!bSpectatorMode)
		{
			/* CASE 3 :*/
			return {galleryWidth: galleryWidth, galleryHeight: galleryHeight,
					bScoreboardBelowGallery: true,
					scoreboardWidth: galleryWidth,
					scoreboardHeight: galleryHeight};
		}		
		
		/*******************************************************************************************
		If here, we are laying out in horizontal mode, the space left to the right of the gallery
		is not wide enough for the scoreboard, and we are on spectator mode so we wont tolerate any scrolling.
		So the solution is to shring the gallery so that we have space for the scoreboard.
		So, recalculate the gallery dimensions, and give it as its max width the
		screen width - space needed for scoreboard.
		*******************************************************************************************/
		galleryDimensions = LayoutCalculator.calculateGalleryDimensions(windowWidth - LayoutCalculator.scoreboardWidthWhenHorizontalLayout(galleryHeight), windowHeight - headerHeight)
		galleryWidth = galleryDimensions.width;
		galleryHeight = galleryDimensions.height;
		
		/* CASE 4 : screen horizontal alignment: place scoreboard beside gallery. Gallery had to be shrunk to fit scoreboard.*/
		return {galleryWidth: galleryWidth, galleryHeight: galleryHeight,
			bScoreboardBelowGallery: false,
			scoreboardWidth: LayoutCalculator.scoreboardWidthWhenHorizontalLayout(galleryHeight),
			scoreboardHeight: galleryHeight};
		
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
	static calculateGalleryDimensions(maxWidth, maxHeight)
	{
		let bTookUpFullMaxWidth = true;
		
		// CASE 1
		let tabletableCanvasWidth = maxWidth - 2*deFactoSpaceForOneFlickityArrow;
		let tabletableCanvasHeight = ((numberOfRowsOnTableCanvas*
												(tabletableCanvasWidth - ((totalNumberOfColsOnTableCanvas + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin)))/
												(totalNumberOfColsOnTableCanvas * cardHeightToWidthFactor)) +
												((numberOfRowsOnTableCanvas + 1)*margin);
		
		// if by setting tabletableCanvasWidth = maxWidth - 2*deFactoSpaceForOneFlickityArrow and maintaining the ration we make the canvas taller than the screen
		if (tabletableCanvasHeight > maxHeight)
		{	
				// CASE 2
				tabletableCanvasHeight = maxHeight;
				tabletableCanvasWidth = ((totalNumberOfColsOnTableCanvas *
											 cardHeightToWidthFactor * (tabletableCanvasHeight - ((numberOfRowsOnTableCanvas + 1)*margin)))/
											 numberOfRowsOnTableCanvas) + ((totalNumberOfColsOnTableCanvas + 1 + extraNumberOfMarginsBetween6thColAndTheRest)*margin);
				bTookUpFullMaxWidth = false;
		}

		return {width: tabletableCanvasWidth + 2*deFactoSpaceForOneFlickityArrow, height: tabletableCanvasHeight, bTookUpFullMaxWidth: bTookUpFullMaxWidth};
	}
	
	static scoreboardWidthWhenHorizontalLayout(galleryHeight)
	{
		return (1/2)*galleryHeight;
	}
}