$(function () {
	const sixNimmtModel = new SixNimmtModel(),
	const sixNimmtView = new SixNimmtView(sixNimmtModel),
	const sixNimmtController = new SixNimmtController(model, view);
});