let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// allow files in public directory to be served as static files
app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile( __dirname + "/" + "index.html" );
});

io.on('connection', function(socket) {
	console.log('A user connected');
 
	socket.on('disconnect', function () {
	   console.log('A user disconnected');
	});

	socket.on("newGame", function onNewGame(data){
		console.log("New game started");
	});
 });

http.listen(80, function() {
	console.log("Listening on port 80.");
});
