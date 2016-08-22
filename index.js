var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();




// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.listen((process.env.PORT || 80));


// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot, updating')
})

// for Facebook verification
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.EAADMqKKZA0yQBAIZCb4jzRViQk75aaa1bglder12kSJ7vFXuFyAwrAQHbyOcdqGW3MKEigwh1bth9VZCNV8AA7qU4k6hRD5vEqMitHGksKiZB0WCGfQSI50znPOZCPoHVYQZBzwSHXuPYCZCPy39WFSY6dioedSNxshgmZAtf4a0awZDZD},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};



