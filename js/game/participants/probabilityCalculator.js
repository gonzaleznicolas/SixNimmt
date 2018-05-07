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
		

		/*
		The problem we are trying to solve is this:
		What is the probability that exactly H players have a killer card.
		We know:
			- the number of cards out there we havent seen
			- how many of those are killer cards (would go on this row before mine)
			- how many cards each player has in their hand
			- number of players other than me

		It is easier to think of this problem as a problem of balls in a bag.
		Suppose these are the input numbers:
			- the number of cards out there we havent seen (50)
			- how many of those are killer cards (would go on this row before mine) (5)
			- how many cards each player has in their hand (6)
			- number of players other than me (4)
			- H (3)
		
		Then think of the problem like this:
		There are 50 balls in a bag. 5 of those are red, and the rest are blue. There are 4 bins. We are to pick balls
		at random out of the bag and fill the bins with 6 balls each, one by one.
		What is the probability that exactly 3 out of the 4 bins will have at least one red ball?
		*/

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
		
		this.recursiveHelper( 1, [], 0);
		
		return Math.min(this._p_H_playersHaveKillerCard, 1);
	}

	/*
	This function will find all the ways in which the bins can be filled such that exactly H have at least one red.
	For each of those ways, it will calculate the probability of that happening, and add all of the cases up.

	Note: the version of this function that found ALL the combinations was too slow. Eg: [0, 1, 1], [1, 0, 1], [1, 1, 0]
	would all be different cases and their probability would be calculated separately.
	An optimization was made. I found that the probability of those three cases was almost the same (varied by less than 0.00000000001)
	So, the function now only finds combinations that are in increasing order. I.e. from the example above, it would only find [0, 1, 1],
	and then it multiplies that probability by 3.
	The nRedInPreviousBin parameter is whats used to enforce the increasing order condition.
	*/
	recursiveHelper(currentDepth, sequence, nRedInPreviousBin)
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
		
		for (let nRedForThisBin = nRedInPreviousBin; nRedForThisBin <= this._max_n_redsABinCanHave; nRedForThisBin++)
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
					let nDistinctPermutationsOfNewSequence = factorial(newSequence.length);
					let distinctValuesInNewSequence = removeDuplicatesFromSortedArray(newSequence);
					distinctValuesInNewSequence.forEach( function (val){
						let nOccurrencesOfValInNewSequence = countOccurencesInArray(newSequence, val);
						nDistinctPermutationsOfNewSequence = nDistinctPermutationsOfNewSequence/factorial(nOccurrencesOfValInNewSequence);
					});
					
					this._p_H_playersHaveKillerCard += (pBinsAreFilledAccordingToNewSequence * nDistinctPermutationsOfNewSequence);
					//console.log(newSequence);
					//console.log(pBinsAreFilledAccordingToNewSequence);
				}
			}
			else
				this.recursiveHelper(currentDepth + 1, newSequence, nRedForThisBin);
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

function factorial(n)
{
	if (factorialCache[n] == undefined)
		prepareFactorialCacheUpTo(Math.max(n, 104));
	return factorialCache[n];
}

let factorialCache = [];

function prepareFactorialCacheUpTo(n)
{
	factorialCache = [1]; // 0! is 1
	let f = 1;
	for (let i = 1; i <= n; i++)
	{
		f = f*i;
		factorialCache[i] = f;
	}
}

// combination
function C(n, r)
{
	if (n < r)
		throw "Error: It is not the case that n >= r >= 0";
	return Math.round(factorial(n)/(factorial(r)*factorial(n-r)));
}

// does not modify array passed in, returns a new array
function removeDuplicatesFromSortedArray(original)
{
	let copy = original.slice();
	let i = 0;
	while (i < copy.length)
	{
		if (copy[i+1] == copy[i])
			copy.splice(i, 1);
		else
			i++;
	}
	
	return copy;
}

function countOccurencesInArray(array, element)
{
	let count = 0;
	array.forEach( (e) => {
		if (e == element)
			count++;
	});
	
	return count;
}