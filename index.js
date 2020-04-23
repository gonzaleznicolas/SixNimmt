'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
const dotenv = require('dotenv');
require('./js/setupController.js')(require('socket.io')(http));

dotenv.config();

// allow files in public directory to be served as static files
app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile( __dirname + "/index.html" );
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 5000;
http.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}...`);
});

