"use strict";

class RoundController {
	constructor(tableView, headerView, scoreboardView, model, name)
	{
		this._tableView = tableView;
		this._headerView = headerView;
		this._scoreboardView = scoreboardView;
		this._model = model;
		this._name = name;

		this._activeRoundStepSequence = [];

		this._tableView.Animation.Drawer.Canvas.addEventListener("click", this.onTableCanvasClicked.bind(this), false);

		// SERVER TO CLIENT - GAME EVENTS
		socket.on("serverRoundInfo", this.onRoundInfo.bind(this));
	}

	onRoundInfo(roundStepSequence)
	{
		console.log("onRoundInfo");

		this._headerView.clear();
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

	updateModelAndDrawFromTableImage(tableImage)
	{
		this._model.Table = tableImage.table;
		this._model.BUpcomingCardsFaceUp = tableImage.upcomingCards.bFaceUp;
		this._model.UpcomingCards = tableImage.upcomingCards.cards;
		this._model.HighlightedUpcomingCard = tableImage.upcomingCards.highlighted;
		this._tableView.draw();
	}

	afterStep(afterImage)
	{
		this.updateModelAndDrawFromTableImage(afterImage);
		this._headerView.clear();
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
				this._tableView.Animation.flipAllUpcomingCards(
										this.afterStep.bind(this),	// callback
										step.afterImage	// callback param
									);
			}
			else if (step.stepType == RoundStepTypes.SortUpcomingCards)
			{
				setTimeout( function() {
					this._headerView.set(sortCardsStr);
					this._tableView.Animation.sortUpcomingCards(
												this.afterStep.bind(this), // callback
												step.afterImage	// callback param
				);}.bind(this), 1000);
			}
			else if (step.stepType == RoundStepTypes.MoveIthCardToRowCol)
			{
				setTimeout( function() {this._tableView.Animation.moveIthUpcomingCardToRowCol(
										step.stepParams.i,
										step.stepParams.tableRow,
										step.stepParams.tableCol,
										this.afterStep.bind(this), // callback
										step.afterImage	// callback param
									);}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.AskPlayerToChooseARowToTake)
			{
				setTimeout( function() { 
					this.dealWithAskPlayerToChooseARowToTakeAnimation(step.stepParams.nameOfPlayerToChooseRow,
																		step.tableImage);
				}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.TakeRow)
			{
				setTimeout( function() {this._tableView.Animation.takeRow(
										step.stepParams.rowIndex,
										step.stepParams.bDisapearAtTheEnd,
										this.afterStep.bind(this), // callback
										step.afterImage	// callback param
									);}.bind(this), 500);
			}
			else if (step.stepType == RoundStepTypes.MoveRows)
			{
				setTimeout( function() {this._tableView.Animation.moveRows(
										step.stepParams.fromRow,
										step.stepParams.toRow,
										step.stepParams.downThisManyRows,
										this.afterStep.bind(this), // callback
										step.afterImage	// callback param
									);}.bind(this), 1500);
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
		this._headerView.clear();
		this._activeRoundStepSequence.shift();
		socket.emit('clientRowToTake', this._model.SelectedRow);
	}
}