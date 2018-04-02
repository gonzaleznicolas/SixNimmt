let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// allow files in public directory to be served as static files
app.use(express.static('public'));


app.get('/', function(req, res){
	res.sendFile( __dirname + "/" + "home.html" );
});

http.listen(80, function() {
	console.log("Listening on port 80.");
});