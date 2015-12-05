var readline = require('readline');

var google = require('googleapis');
var secrets = require('../config/secrets');

var OAuth2Client = google.auth.OAuth2;
var youtube = google.youtube('v3');


//var key = require('./config/secrets');
//var google = require('googleapis');
//var OAuth2 = google.auth.OAuth2;
//
//var oauth2Client = new OAuth2(key.CLIENT_ID, key.CLIENT_SECRET, key.REDIRECT_URL);
//
//var scopes = [
//    'https://www.googleapis.com/auth/youtube'
//];
//
//var url = oauth2Client.generateAuthUrl({
//    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
//    scope: scopes
//});

var oauth2Client = new OAuth2Client(secrets.CLIENT_ID, secrets.CLIENT_SECRET, secrets.REDIRECT_URL);

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
    // generate consent page url
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        scope: 'https://www.googleapis.com/auth/youtube'
    });

    console.log('Visit the url: ', url);
    rl.question('Enter the code here:', function(code) {
        // request access token
        oauth2Client.getToken(code, function(err, tokens) {
            // set tokens to the client
            // TODO: tokens should be set by OAuth2 client.
            oauth2Client.setCredentials(tokens);
            callback();
        });
    });
}

// retrieve an access token
getAccessToken(oauth2Client, function() {
    // retrieve user profile
    youtube.channels.list({auth: oauth2Client, part: 'snippet' }, function(err, data) {
        if (err) {
            console.log('An error occured', err);
            return;
        }
        console.log('data...', data);
    });
});


