const dateTimeFormat = new Intl.DateTimeFormat("en-US", {year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", timeZoneName: "short"});
$(function () {
	new gridjs.Grid({
		columns: ['Date', 'Players'],
		pagination: {
		  enabled: true,
		  limit: 5,
		  server: {
			url: (prev, page, limit) => `${prev}?offset=${page * limit}&limit=${limit}`
		  }
		},
		server: {
		  url: '/gameLog',
		  then: data => data.results.map(game =>
			[dateTimeFormat.format(new Date(`${game.date} UTC`)),
			game.player_list]),
		  total: data => data.count
		} 
	  }).render($("#gridWrapper")[0]);
});
