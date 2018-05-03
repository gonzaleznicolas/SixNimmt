'use strict';

module.exports = class ProbabilityCalculator
{
	constructor(){}

	calc_p_H_playersHaveKillerCard(
		nCardsWhichIHaveNotSeen, // this includes all the cards that were not used for this iteration. (eg if there are only 2 players, each is delt 10, 4 are placed on the table, so only 24/104 cards are used)
		nCardsWhichWouldGoOnThisRowBeforeMine,
		nCardsLeftInEachPlayersHand,
		nPlayersOtherThanMe,
		h
	)
	{
		if (nCardsWhichIHaveNotSeen < nPlayersOtherThanMe * nCardsLeftInEachPlayersHand)
			throw "Error: You have seen more cards than everything other than whats in the others' hands? Impossible"
		
		this._nBallsInBag = nCardsWhichIHaveNotSeen;
		this._nRedBallsInBag = nCardsWhichWouldGoOnThisRowBeforeMine;
		this._nBlueBallsInBag = this._nBallsInBag - this._nRedBallsInBag;
		this._nBallsPerBin = nCardsLeftInEachPlayersHand;
		this._nBins = nPlayersOtherThanMe;
		this._nBinsWithAtLeastOneRed = h;
		this._nBinsWithAllBlue = this._nBins - this._nBinsWithAtLeastOneRed;
		
		this._total_n_waysToFillBins = this.calc_total_nWaysToFillBins();
		
		this._p_H_playersHaveKillerCard = 0;
		
		this._max_n_redsABinCanHave = Math.min(this._nRedBallsInBag - this._nBinsWithAtLeastOneRed + 1, this._nBallsPerBin);
		this._lastDepth = this._nBins;
		this._nBlueBins = this._nBinsWithAllBlue;
		this._nRedBins = this._nBinsWithAtLeastOneRed;
		this._totalRedAvailable = this._nRedBallsInBag;
		
		this.recursiveHelper( 1, []);
		
		console.log(this._p_H_playersHaveKillerCard);
		
		
		return this._p_H_playersHaveKillerCard;
	}

	recursiveHelper(currentDepth, sequence)
	{
		// "this one" is a bin
		// remaining means after this one
		// so far means before this one
		// blue bins are the bins with all blue balls
		// red bins are the bins with at least one red
		let nRemainingBins = this._lastDepth - currentDepth;
		let nBlueBinsSoFar = sequence.filter( n => n == 0).length;
		let nRedBinsSoFar = sequence.filter( n => n > 0).length;
		let sequenceSumSoFar = this.sequenceSum(sequence);
		
		for (let nRedForThisBin = 0; nRedForThisBin <= this._max_n_redsABinCanHave; nRedForThisBin++)
		{
			let thisOneIsRed = false;
			let thisOneIsBlue = false;
			let nRemainingRedBins;
			if (nRedForThisBin > 0)
			{
				thisOneIsRed = true;
				thisOneIsBlue = false;
				nRemainingRedBins = this._nRedBins - nRedBinsSoFar - 1;
			}
			else
			{
					thisOneIsBlue = true;
					thisOneIsRed = false;
					nRemainingRedBins = this._nRedBins - nRedBinsSoFar;
			}	
			
			if (thisOneIsBlue && nBlueBinsSoFar == this._nBlueBins)
				continue;
			if (thisOneIsRed && nRedBinsSoFar == this._nRedBins)
				continue;
			if (sequenceSumSoFar + nRedForThisBin + nRemainingRedBins > this._totalRedAvailable)
				continue;
			
			let newSequence = sequence.slice();
			newSequence.push(nRedForThisBin);
			if (nRemainingBins == 0)
			{
				if (this.thereAreEnoughRedAndBlueBallsForSequence(newSequence))
				{
					let pBinsAreFilledAccordingToNewSequence = this.calc_nWaysToFillBinsAccordingToSequence(newSequence) / this._total_n_waysToFillBins;
					this._p_H_playersHaveKillerCard += pBinsAreFilledAccordingToNewSequence;
					//console.log(newSequence);
				}
			}
			else
				this.recursiveHelper(currentDepth + 1, newSequence);
		}
	}

	calc_nWaysToFillBinsAccordingToSequence(sequence)
	{
		// the array sequence is as long as the number of bins
		// the number in the array represents the number of red balls in the bin at that index
		
		let nRedLeftInBag = this._nRedBallsInBag;
		let nBlueLeftInBag = this._nBlueBallsInBag;
		
		let nWaysToFillBinsAccordingToSequence = 1;
		for (let b = 0; b < sequence.length; b++)
		{
			let nRedBallsInThisBin = sequence[b];
			let nBlueBallsInThisBin = this._nBallsPerBin - nRedBallsInThisBin;
			
			// take reds out of bag
			nWaysToFillBinsAccordingToSequence *= C(nRedLeftInBag, nRedBallsInThisBin);
			nRedLeftInBag -= nRedBallsInThisBin;
			
			// take blues out of bag
			nWaysToFillBinsAccordingToSequence *= C(nBlueLeftInBag, nBlueBallsInThisBin);
			nBlueLeftInBag -= nBlueBallsInThisBin;
		} 
		
		return nWaysToFillBinsAccordingToSequence;
	}

	calc_total_nWaysToFillBins()
	{
		let nBallsLeftInBag = this._nBallsInBag;
		
		let total_ways = 1;
		for (let b = 0; b < this._nBins; b++)
		{
			let nBallsForThisBin = this._nBallsPerBin;		
			// take balls out of bag
			total_ways *= C(nBallsLeftInBag, nBallsForThisBin);
			nBallsLeftInBag -= nBallsForThisBin;
		} 
		
		return total_ways;
	}

	thereAreEnoughRedAndBlueBallsForSequence(sequence)
	{
		let nRequiredRedBalls = this.sequenceSum(sequence);
		let nRequiredBlueBalls = this._nBins*this._nBallsPerBin - nRequiredRedBalls;
		
		return nRequiredRedBalls <= this._nRedBallsInBag && nRequiredBlueBalls <= this._nBlueBallsInBag;
	}

	sequenceSum(sequence)
	{
		return sequence.length == 0 ? 0 : sequence.reduce(function(acc, val) { return acc + val; });
	}

	p_outOf_N_Players_K_ChooseCard(N, K, pAPlayerWillChooseCard)
	{
		let p = pAPlayerWillChooseCard;
		return C(N, K) * Math.pow(p, K) * Math.pow(1-p, N-K);
	}

}

function factorial(n){
	if (n < 0) 
		throw "Error: cant take factorial of a negative number";
	if (n == 0) 
		return 1;
	let i= n;
	while(--i) n*= i;
	return n;
}

// combination
function C(n, r)
{
	if (n < r)
		throw "Error: It is not the case that n >= r >= 0";
	return Math.round(factorial(n)/(factorial(r)*factorial(n-r)));
}
