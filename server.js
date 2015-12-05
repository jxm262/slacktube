'use strict';

const Hapi = require('hapi');

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


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 9004
});


/*****************************************************************************
 * todo: move this code
 ****************************************************************************/
var google = require('googleapis');
var secrets = require('./config/secrets');

var OAuth2Client = google.auth.OAuth2;
var youtube = google.youtube('v3');

var oauth2Client = new OAuth2Client(secrets.CLIENT_ID, secrets.CLIENT_SECRET, secrets.REDIRECT_URL);

server.route({
    method: 'GET',
    path: '/login',
    handler: function (request, reply) {
        var url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // will return a refresh token
            scope: 'https://www.googleapis.com/auth/youtube'
        });

        return reply.redirect(url);
    }
});


server.route({
    method: 'GET',
    path: '/oauthcallback',
    handler: function (request, reply) {
        var code = request.query.code;
        oauth2Client.getToken(code, function (err, tokens) {
            oauth2Client.setCredentials(tokens);
            console.log('tokens', tokens);
            return reply('logged in with tokens - ' + tokens);
        });
    }
});

server.route({
    method: 'GET',
    path: '/playlists',
    handler: function (request, reply) {
        var params = {
            auth: oauth2Client,
            part: 'snippet',
            mine: true
        };

        youtube.playlists.list(params, function (err, data) {
            if (err) {
                return reply(err);
            }

            let items = {items: data.items};
            return reply(items);
        });
    }
});

server.route({
    method: 'GET',
    path: '/playlist/{playlistId}/items',
    handler: function (request, reply) {

        console.log('here');
        var tokens = {
            access_token: 'ya29.QQIqoImFrdyJFEPgkbHd2f4nEf09f5v3mOzyaaBC3Hsks4XP1HZK2c0losvwNd26zhm8',
            token_type: 'Bearer',
            refresh_token: '1/7jn47jSYpMotH8_VGGGfBZHn8Lr-KBtJjnKvdAjhWCo',
            expiry_date: 1449347914387
        };

        var oauth2Client2;
        oauth2Client2 = new OAuth2Client(secrets.CLIENT_ID, secrets.CLIENT_SECRET, secrets.REDIRECT_URL);
        oauth2Client2.setCredentials(tokens);

        var params = {
            auth: oauth2Client2,
            part: 'snippet',
            playlistId: request.params.playlistId
        };

        youtube.playlistItems.list(params, function (err, data) {
            if (err) {
                return reply(err);
            }

            //Note - to watch video , redirect to youtube.com/watch?v=<id>
            //youtube.com/watch?v=-Fulz4ytZ54
            return reply(data);
        });
    }
});




/*****************************************************************************
 *****************************************************************************/


server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});