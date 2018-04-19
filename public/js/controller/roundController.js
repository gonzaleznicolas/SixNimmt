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

		if (data.nameOfPlayerWhoAskedToRewatch)
		{
			this._headerView.set(`${data.nameOfPlayerWhoAskedToRewatch} ${wantedToRewatchStr}`);
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
		console.log('This participant is done displaying the round.');
		if (bSpectatorMode)
		{
			this.tellServerDontWantToRewatch();
		}
		else
		{
			console.log('Done displaying round, but this is a player, so ask the user if they want to watch again before emitting clientDoneDisplayingRound');
			dialog.set(doYouWantToRewatchRoundStr, continueStr, this.tellServerDontWantToRewatch.bind(this), rewatchStr, this.tellServerWantToRewatch.bind(this));
		}
	}

	tellServerDontWantToRewatch()
	{
		console.log('client has chosen not to rewatch round');
		socket.emit("clientDoneDisplayingRound", false);
	}

	tellServerWantToRewatch()
	{
		console.log('client has chosen to rewatch round');
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
				this.afterStep(step.tableImage);
			}
			else if (step.stepType == RoundStepTypes.FlipAllUpcomingCards)
			{
				setTimeout( function () {
					this._tableView.Animation.flipAllUpcomingCards(
						this.afterStep.bind(this),	// callback
						step.afterImage	// callback param
					);
				}.bind(this), 200);
			}
			else if (step.stepType == RoundStepTypes.SortUpcomingCards)
			{
				setTimeout( function() {
					this._tableView.Animation.sortUpcomingCards(
						this.afterStep.bind(this), // callback
						step.afterImage	// callback param
					);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.MoveIthCardToRowCol)
			{
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
				setTimeout( function() { 
					this.dealWithAskPlayerToChooseARowToTakeAnimation(
						step.stepParams.nameOfPlayerToChooseRow,
						step.tableImage
					);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.TakeRow)
			{
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
				this._headerView.set(`${step.stepParams.nameOfPlayerWhoTookRow} ${selectedRowStr} ${step.stepParams.rowSelected + 1}`);
				setTimeout( function() {
					this._activeRoundStepSequence.shift();
					this.dealWithRoundStepSequence();
				}.bind(this), 1000);
			}
			else if (step.stepType == RoundStepTypes.ClearHeader)
			{
				this._headerView.clear();
				this._activeRoundStepSequence.shift();
				this.dealWithRoundStepSequence();
			}
			else if (step.stepType == RoundStepTypes.IncrementPlayerScore)
			{
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
				this._scoreboardView.setScoreboard(step.scoreboard);
				this._activeRoundStepSequence.shift();
				this.dealWithRoundStepSequence();
			}
			else if (step.stepType == RoundStepTypes.RoundDone)
			{
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