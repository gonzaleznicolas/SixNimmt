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
		this.scoreboardElementsPerRowOnVerticalLayout = 4;
		
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
		this.scoreboardElementWidth = undefined;
		this.scoreboardElementHeight = undefined;
	}
	
	/************************************************************************************
	Based on the window dimensions, this function will set the following of its own attributes:
		- galleryWidth
		- galleryHeight
		- bScoreboardBelowGallery
		- scoreboardWidth
		- scoreboardHeight
		- scoreboardElementWidth
		- scoreboardElementHeight
	*************************************************************************************/
	calculate()
	{
		// Note: we never want the user to have to horizontal scroll.
		// Especially because of flickity. The swipe right or left should move flickity not scroll.
		// We are okay with vertical scrolling as long as we are not in spectator mode. In spectator mode
		// there should be no scrolling. This is because spectator mode means the screen is up on a tv or something where you dont want to scroll.
		// But spectator mode also means its probably a big screen, so if things dont fit naturally, we can shrink them and thats okay.
		
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();
		const headerHeight = $('header').height();

		// see what dimensions the gallery takes if you give it the full screen (minus the header)
		this.setGalleryDimensionsANDbScoreboardBelowGallery(windowWidth, windowHeight - headerHeight)

		if (this.bScoreboardBelowGallery)
		{
			this.scoreboardWidth = this.galleryWidth;
			this.setScoreboardHeightAndScoreboardElementDimensionsWhenVerticalLayout();
			
			// if the content fints in the window OR we are in NOT in spectator mode, we are done
			if (this.galleryHeight + this.scoreboardHeight + headerHeight < windowHeight || !bSpectatorMode)
				return;
		}
		
		// if here, either:
		//		1) From the beginning there was naturally space on the side of the gallery for the scoreboard OR
		//		2) There was naturally space on the bottom of the gallery but not enough to aavoid scrolling, and we are in spectator mode so scrolling is not okay
		// so, lets put the scoreboard on the side.
		this.bScoreboardBelowGallery = false; // bScoreboardBelowGallery may already be false, if we didnt even go in the first if.
		this.scoreboardHeight = this.galleryHeight;
		this.setScoreboardWidthAndScoreboardElementDimensionsWhenHorizontalLayout();
		
		// if the scoreboard fits on the side without horizontal scrolling, we are done
		if (this.galleryWidth + this.scoreboardWidth < windowWidth)
			return;

		
		this.setGalleryDimensionsANDbScoreboardBelowGallery(windowWidth - this.scoreboardWidth, windowHeight - headerHeight);

		this.bScoreboardBelowGallery = false;
		this.scoreboardHeight = this.galleryHeight;
		this.setScoreboardWidthAndScoreboardElementDimensionsWhenHorizontalLayout();
		
		return;
	}
	
	setScoreboardWidthAndScoreboardElementDimensionsWhenHorizontalLayout()
	{
		this.scoreboardElementHeight = (this.galleryHeight - (maxNumberOfPlayers + 1)*this.margin)/maxNumberOfPlayers;
		this.scoreboardElementWidth = this.scoreboardElementHeight*this.scoreboardElementHeightToWidthFactor;
		this.scoreboardWidth = this.scoreboardElementWidth + 2*this.margin;
	}
	
	setScoreboardHeightAndScoreboardElementDimensionsWhenVerticalLayout()
	{
		let numberOfRows = Math.ceil(numberOfPlayers/this.scoreboardElementsPerRowOnVerticalLayout);
		this.scoreboardElementWidth = (this.galleryWidth - (this.scoreboardElementsPerRowOnVerticalLayout + 1)*this.margin)/this.scoreboardElementsPerRowOnVerticalLayout;
		this.scoreboardElementHeight = this.scoreboardElementWidth * (1/this.scoreboardElementHeightToWidthFactor);
		this.scoreboardHeight = numberOfRows*this.scoreboardElementHeight + (numberOfRows + 1)*this.margin;
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
	setGalleryDimensionsANDbScoreboardBelowGallery(maxWidth, maxHeight)
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

		this.galleryWidth = tabletableCanvasWidth + 2*this.deFactoSpaceForOneFlickityArrow;
		this.galleryHeight = tabletableCanvasHeight;
		this.bScoreboardBelowGallery = bTookUpFullMaxWidth;
	}
}
