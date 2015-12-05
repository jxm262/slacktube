'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 9004
});


/*****************************************************************************
 * todo: move this code
 ****************************************************************************/
const google = require('googleapis');
const secrets = require('./config/secrets');

const OAuth2Client = google.auth.OAuth2;
const youtube = google.youtube('v3');

const oauth2Client = new OAuth2Client(secrets.CLIENT_ID, secrets.CLIENT_SECRET, secrets.REDIRECT_URL);

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
        const code = request.query.code;
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
        const params = {
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
        const params = {
            auth: oauth2Client,
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

server.route({
    method: 'GET',
    path: '/playlist/items/add',
    handler: function (request, reply) {
        const playlistId = request.params.playlistId;

        const params = {
            auth: oauth2Client,
            part: 'snippet',
            resource: {
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: '-Fulz4ytZ54'
                    }
                }
            }
        };

        youtube.playlistItems.insert(params, function (err, data) {
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