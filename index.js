let express = require('express');
let app = express();
let http = require('http').Server(app);
let bodyParser = require('body-parser');
let io = require('socket.io')(http);

// allow files in public directory to be served as static files
app.use(express.static('public'));

// in order to parse post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.sendFile( __dirname + "/" + "home.html" );
});

const FormType = Object.freeze({ "NewGame": 1, "vsAI": 2, "JoinGame": 3, "SpectateGame": 4 })
app.post('/process_form', function (req, res) {
	let formType = req.body.formType;
	if (formType == FormType.NewGame)
	{
		console.log(formType);
	}
	else if (formType == FormType.vsAI)
	{
		console.log(formType);
	}
	else if (formType == FormType.JoinGame)
	{
		console.log(formType);
	}
	else // formType == FormType.SpectateGame
	{
		console.log(formType);
	}
 })

http.listen(80, function() {
	console.log("Listening on port 80.");
});