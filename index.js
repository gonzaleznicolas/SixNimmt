let express = require('express');
let app = express();
let http = require('http').Server(app);
let bodyParser = require('body-parser');
let io = require('socket.io')(http);

// allow files in public directory to be served as static files
app.use(express.static('public'));

// allow files in public directory to be served as static files
app.use(express.static('public'));
 
// in order to parse post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.sendFile( __dirname + "/" + "index.html" );
});

app.post('/form', function(req, res){
	console.log('got message');
	res.json({hi:"hello world"});
});

http.listen(80, function() {
	console.log("Listening on port 80.");
});