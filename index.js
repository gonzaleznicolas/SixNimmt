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

app.get('/gameLog', function(req, res, next){
	const offset = parseInt(req.query.offset);
	const rowCount = parseInt(req.query.rowCount);
	if (Number.isNaN(offset) || Number.isNaN(rowCount)) {
		const err = new Error("Bad parameters");
		err.statusCode = 400;
		next(err);
	} else {
		const dbConnection = DbManager.getConnection();
		DbManager.connect(dbConnection);
		dbConnection.query(
			`SELECT date, player_list FROM games_played LIMIT ?, ?`,
			[offset, rowCount],
			(err, results) => {
				if (err){
					const msg = "An error occured fetching games played from the database.";
					console.error(msg);
					console.error(err);
					next(new Error(msg));
				} else {
					console.log(`Successfully read game log with offset ${offset} and rowCount ${rowCount}`);
					res.json(results);
				}
			}
		);
		DbManager.end(dbConnection);
	}
});

// Listen to the App Engine-specified port, or 5000 otherwise
const PORT = process.env.NIMMT_PORT || 5000;
http.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}...`);
});

