'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
const dotenv = require('dotenv');
dotenv.config();
const DbManager = require('./js/dbManager.js');
require('./js/setupController.js')(require('socket.io')(http));


// allow files in public directory to be served as static files
app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile( __dirname + "/index.html" );
});

app.get('/about', function(req, res){
	res.sendFile( __dirname + "/about.html" );
});

app.get('/howToPlay', function(req, res){
	res.sendFile( __dirname + "/howToPlay.html" );
});

app.get('/gameLog', function(req, res){
	res.sendFile( __dirname + "/gameLog.html" );
});

app.get('/gameLogPage', function(req, res, next){
	const offset = parseInt(req.query.offset);
	const limit = parseInt(req.query.limit);
	if (Number.isNaN(offset) || Number.isNaN(limit)) {
		const err = new Error("Bad parameters");
		err.statusCode = 400;
		next(err);
	} else {
		const countConnection = DbManager.getConnection();
		DbManager.connect(countConnection);
		let count;
		countConnection.query("SELECT COUNT(id) as count FROM games_played;", (err, results) => {
			if (err){
				const msg = "An error occured fetching games_played count from the database.";
				console.error(msg);
				console.error(err);
				next(new Error(msg));
			} else {
				count = results[0].count;
				const rowsConnection = DbManager.getConnection();
				DbManager.connect(rowsConnection);
				rowsConnection.query(
					`SELECT \`date\`, GROUP_CONCAT(\`player\`.\`name\` SEPARATOR ', ') as \`players\`
					FROM \`six-nimmt\`.\`game\`
					JOIN \`six-nimmt\`.\`player\`
					ON \`game\`.\`id\` = \`player\`.\`game_id\`
					GROUP BY \`game\`.\`id\`
					ORDER BY \`date\` DESC
					LIMIT ?, ?;`,
					[offset, limit],
					(err, results) => {
						if (err){
							const msg = "An error occured fetching games played from the database.";
							console.error(msg);
							console.error(err);
							next(new Error(msg));
						} else {
							console.log(`Successfully read game log with offset ${offset} and limit ${limit}`);
							res.json({
								count,
								results
							});
						}
					}
				);
				DbManager.end(rowsConnection);
			}
		});
		DbManager.end(countConnection);
	}
});

app.get('/migrate', function(req, res, next){
	const gamesPlayedConnection = DbManager.getConnection();
	DbManager.connect(gamesPlayedConnection);
	let count;
	gamesPlayedConnection.query("SELECT * FROM games_played;", (err, results) => {
		if (err){
			const msg = "An error occured fetching games_played from the database.";
			console.error(msg);
			console.error(err);
			next(new Error(msg));
		} else {
			// let sqlQuery = "";
			// results.forEach(game => {
			// 	sqlQuery = sqlQuery + `INSERT INTO \`six-nimmt\`.game (\`id\`, \`date\`) VALUES (${game.id}, '${game.date}');`;
			// });
			// res.json(sqlQuery);

			let sqlQuery = `INSERT INTO \`six-nimmt-test\`.player (\`game_id\`, \`name\`, \`is_bot\`) VALUES `
			results.forEach(game => {
				const listOfPlayers = game.player_list.split(",");
				listOfPlayers.forEach(player => {
					sqlQuery = sqlQuery + `(${game.id}, '${player}', ${Number(player.includes("Bot"))}), `;
				});
			});
			res.json(sqlQuery);
		}
	});
	DbManager.end(gamesPlayedConnection);
});

// Listen to the App Engine-specified port, or 5000 otherwise
const PORT = process.env.NIMMT_PORT || 5000;
http.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}...`);
});

