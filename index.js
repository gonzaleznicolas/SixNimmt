'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
require('./js/startupController.js')(require('socket.io')(http));

// allow files in public directory to be served as static files
app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile( __dirname + "/index.html" );
});

http.listen(80, function() {
	console.log("Listening on port 80.");
});

