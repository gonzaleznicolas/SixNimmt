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
		  then: data => data.results.map(game => [game.date, game.player_list]),
		  total: data => data.count
		} 
	  }).render($("#gridWrapper")[0]);
});
