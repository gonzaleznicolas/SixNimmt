"use strict";

class RoundController {
	constructor(tableView, handView, headerView, scoreboardView, model, name)
	{
		this._tableView = tableView;
		this._handView = handView;
		this._headerView = headerView;
		this._scoreboardView = scoreboardView;
		this._model = model;
		this._name = name;
		this._dontShowRoundReplayDialog = false;

		this._activeRoundStepSequence = [];

		this._tableView.Animation.Drawer.Canvas.addEventListener("click", this.onTableCanvasClicked.bind(this), false);

		// SERVER TO CLIENT - GAME EVENTS
		socket.on("serverRoundInfo", this.onRoundInfo.bind(this));
	}

	onRoundInfo(data)
	{
		console.log("onRoundInfo");
		let roundStepSequence = data.roundStepSequence;

		dialog.close();
		this._headerView.clear();

		if (data.bItsAReplay)
		{
			this._headerView.set(someoneWantedToRewatchStr);
		}

		if(this._activeRoundStepSequence.length > 0)
		{
			this._activeRoundStepSequence = this._activeRoundStepSequence.concat(roundStepSequence);
		}
		else
		{
			this._activeRoundStepSequence = roundStepSequence;
			this.dealWithRoundStepSequence();
		}
	}

	doneDisplayingRound()
	{
		if (bSpectatorMode)
		{
			console.log('This spectator is done displaying the round.');
			this.tellServerDoneDisplayingRoundAndDontWantToRewatch();
		}
		else
		{
			console.log('This player is done displaying the round.');
			if (!this._dontShowRoundReplayDialog)
			{
				console.log('Ask the user if they want to watch again before emitting clientDoneDisplayingRound');
				dialog.set(doYouWantToRewatchRoundStr,
					rewatchStr,
					this.tellServerDoneDisplayingRoundAndWantToRewatch.bind(this),
					continueStr,
					this.tellServerDoneDisplayingRoundAndDontWantToRewatch.bind(this),
					dontShowDialogStr,
					this.setDontShowRoundReplayDialog.bind(this)
				);
			}
			else
			{
				console.log("no need to ask the user if they want to rewatch");
				this.tellServerDoneDisplayingRoundAndDontWantToRewatch();
			}
		}
	}

	setDontShowRoundReplayDialog(bool)
	{
		console.log(`The value of _dontShowRoundReplayDialog has been set to ${bool}`);
		this._dontShowRoundReplayDialog = bool;
	}

	tellServerDoneDisplayingRoundAndDontWantToRewatch()
	{
		console.log('emmitting clientDoneDisplayingRound no need to rewatch');
		socket.emit("clientDoneDisplayingRound", false);
	}

	tellServerDoneDisplayingRoundAndWantToRewatch()
	{
		console.log('emmitting clientDoneDisplayingRound requesting to rewatch');
		socket.emit("clientDoneDisplayingRound", true);
	}

	updateModelAndDrawFromTableImage(tableImage)
	{
		this._model.Table = tableImage.table;
		this._model.BUpcomingCardsFaceUp = tableImage.upcomingCards.bFaceUp;
		this._model.UpcomingCards = tableImage.upcomingCards.cards;
		this._model.HighlightedUpcomingCard = tableImage.upcomingCards.highlighted;
		this._model.OnlyDrawUpcomingCardsAfterThisIndex = tableImage.upcomingCards.onlyDrawCardsAfterThisIndex;
		this._tableView.draw();
	}

	afterStep(afterImage)
	{
		this.updateModelAndDrawFromTableImage(afterImage);
		this._activeRoundStepSequence.shift();
		this.dealWithRoundStepSequence();
	}

	dealWithRoundStepSequence()
	{
		let step = this._activeRoundStepSequence[0];
		if (step)
		{
			if (step.stepType == RoundStepTypes.NoAnimationJustTheTableImage)
			{
				console.log('Step NoAnimationJustTheTableImage started');
				this.afterStep(step.tableImage);
			}
			else if (step.stepType == RoundStepTypes.FlipAllUpcomingCards)
			{
				console.log('Step FlipAllUpcomingCards started');
				setTimeout( function () {
					this._tableView.Animation.flipAllUpcomingCards(
						this.afterStep.bind(this),	// callback
						step.afterImage	// callback param
					);
				}.bind(this), 200);
			}
			else if (step.stepType == RoundStepTypes.SortUpcomingCards)
			{
				console.log('Step SortUpcomingCards started');
				setTimeout( function() {
					this._tableView.Animation.sortUpcomingCards(
						this.afterStep.bind(this), // callback
						step.afterImage	// callback param
					);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.MoveIthCardToRowCol)
			{
				console.log('Step MoveIthCardToRowCol started');
				setTimeout( function() {
					this._model.OnlyDrawUpcomingCardsAfterThisIndex = step.stepParams.i;
					this._tableView.Animation.moveIthUpcomingCardToRowCol(
						step.stepParams.i,
						step.stepParams.tableRow,
						step.stepParams.tableCol,
						this.afterStep.bind(this), // callback
						step.afterImage	// callback param
					);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.AskPlayerToChooseARowToTake)
			{
				console.log('Step AskPlayerToChooseARowToTake started');
				setTimeout( function() { 
					this.dealWithAskPlayerToChooseARowToTakeAnimation(
						step.stepParams.nameOfPlayerToChooseRow,
						step.tableImage
					);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.TakeRow)
			{
				console.log('Step TakeRow started');
				setTimeout( function() {
					this._tableView.Animation.takeRow(
						step.stepParams.rowIndex,
						step.stepParams.bDisapearAtTheEnd,
						this.afterStep.bind(this), // callback
						step.afterImage	// callback param
					);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.MoveRows)
			{
				console.log('Step MoveRows started');
				setTimeout( function() {
					this._tableView.Animation.moveRows(
						step.stepParams.fromRow,
						step.stepParams.toRow,
						step.stepParams.downThisManyRows,
						this.afterStep.bind(this), // callback
						step.afterImage	// callback param
					);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.ShowMessageSayingWhichRowWasSelected)
			{
				console.log('Step ShowMessageSayingWhichRowWasSelected started');
				this._headerView.set(`${step.stepParams.nameOfPlayerWhoTookRow} ${selectedRowStr} ${step.stepParams.rowSelected + 1}`);
				setTimeout( function() {
					this._activeRoundStepSequence.shift();
					this.dealWithRoundStepSequence();
				}.bind(this), 1000);
			}
			else if (step.stepType == RoundStepTypes.ClearHeader)
			{
				console.log('Step NoAnimationJustTheTableImage started');
				this._headerView.clear();
				this._activeRoundStepSequence.shift();
				this.dealWithRoundStepSequence();
			}
			else if (step.stepType == RoundStepTypes.IncrementPlayerScore)
			{
				console.log('Step IncrementPlayerScore started');
				// for this one, tell the scoreboard to increment, pass it as a callback a function
				// to set the scoreboard to step.scoreboardAfter, and immediately call dealWithRoundStepSequence.
				// no need to wait for the scoreboard update to finish in order to move on to the next step
				this._scoreboardView.incrementScore(
					step.stepParams.playerName,
					step.stepParams.pointsToAdd,
					function() {
						this._scoreboardView.setScoreboard(step.scoreboardAfter);
					}.bind(this)
				);
				this._activeRoundStepSequence.shift();
				this.dealWithRoundStepSequence();
			}
			else if (step.stepType == RoundStepTypes.ResetScoreboard)
			{
				console.log('Step ResetScoreboard started');
				this._scoreboardView.setScoreboard(step.scoreboard);
				this._activeRoundStepSequence.shift();
				this.dealWithRoundStepSequence();
			}
			else if (step.stepType == RoundStepTypes.RoundDone)
			{
				console.log('got the last step of the round step sequence. step RoundDone');
				this.updateModelAndDrawFromTableImage(step.tableImage);
				this._activeRoundStepSequence = [];
				this._headerView.set(waitingForOthersToFinishDisplayingRoundStr);
				this.doneDisplayingRound();
			}
		}
	}

	// CHOOSE ROW MANAGEMENT

	dealWithAskPlayerToChooseARowToTakeAnimation(nameOfPlayerToChooseRow, tableImage)
	{
		this.updateModelAndDrawFromTableImage(tableImage);
		if (nameOfPlayerToChooseRow == this._name)
		{
			state = ClientStates.SelectRowToTake;
			this._headerView.setFlashingWithButton(selectARowStr, selectRowStr,
													this.onSelectRowClicked.bind(this));
		}
		else
		{
			state = ClientStates.RoundAnimationInProgress;
			this._activeRoundStepSequence.shift();
	
			if(this._activeRoundStepSequence.length == 0)
			{
				this._headerView.setFlashing(`${waitingForStr} ${nameOfPlayerToChooseRow} ${toPickARowStr}`);
			}
			else
			{
				// if the activeRoundStepSequence is not empty, it means there are more steps
				// i.e. the following steps are for after whoever had to choose a card did so
				// i.e. the row to be taken has already been selected. So instead of showing the sign
				// saying "waiting for __ to play a card", just move on to the next step
				this.dealWithRoundStepSequence();
			}
		}
	}

	onTableCanvasClicked(event)
	{
		if (state != ClientStates.SelectRowToTake)
			return;
		const canvasTop = this._tableView.Animation.Drawer.getCanvasOffsetTop();
		const y = event.pageY - canvasTop;

		const clickedRow = this._tableView.Animation.Drawer.getCardRowFromY(y);
		
		if (clickedRow == this._model.SelectedRow)
		{
			this._model.SelectedRow = undefined;
			$('.headerButton').removeClass("selectedHeaderButton");
			this._tableView.draw();
		}
		else if (clickedRow != undefined)
		{
			this._model.SelectedRow = clickedRow;
			$('.headerButton').addClass("selectedHeaderButton");
			this._tableView.draw();
		}
	}

	onSelectRowClicked()
	{
		if (state != ClientStates.SelectRowToTake)
			return;
		if (this._model.SelectedRow == undefined || this._model.SelectedRow < 0 || this._model.SelectedRow >= 4)
			return;
		state = ClientStates.RoundAnimationInProgress;
		this._activeRoundStepSequence.shift();
		socket.emit('clientRowToTake', this._model.SelectedRow);
	}
}