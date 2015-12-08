'use strict';

const Hapi = require('hapi');
const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');
const secrets = require('./config/secrets');
const google = require('googleapis');
const youtube = google.youtube('v3');
const OAuth2Client = google.auth.OAuth2;
const oauth2Client = new OAuth2Client(secrets.CLIENT_ID, secrets.CLIENT_SECRET, secrets.REDIRECT_URL);
const server = new Hapi.Server();


require('babel-core/register')({
    presets: ['react', 'es2015']
});

server.connection({
    host: 'localhost',
    port: 9004
});


server.register(Vision, (err) => {

    if (err) {
        console.log('Failed to load vision.');
    }

    server.views({
        engines: {
            jsx: HapiReactViews
        },
        relativeTo: __dirname,
        path: 'src/views'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {

            reply.view('home');
        }
    });

    server.route({
        method: 'GET',
        path: '/about',
        handler: (request, reply) => {

            reply.view('about');
        }
    });

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});


//server.route({
//    method: 'GET',
//    path: '/login',
//    handler: function (request, reply) {
//        var url = oauth2Client.generateAuthUrl({
//            access_type: 'offline', // will return a refresh token
//            scope: 'https://www.googleapis.com/auth/youtube'
//        });
//
//        return reply.redirect(url);
//    }
//});
//
//
//server.route({
//    method: 'GET',
//    path: '/oauthcallback',
//    handler: function (request, reply) {
//        const code = request.query.code;
//        oauth2Client.getToken(code, function (err, tokens) {
//            console.log('tokens..', tokens);
//            //TODO persist the user and the tokens
//            oauth2Client.setCredentials(tokens);
//            return reply('logged in with tokens - ' + tokens);
//        });
//    }
//});
//
//server.route({
//    method: 'GET',
//    path: '/playlists',
//    handler: function (request, reply) {
//        const params = {
//            auth: oauth2Client,
//            part: 'snippet',
//            mine: true
//        };
//
//        youtube.playlists.list(params, function (err, data) {
//            if (err) {
//                return reply(err);
//            }
//
//            let items = {items: data.items};
//            return reply(items);
//        });
//    }
//});
//
//server.route({
//    method: 'GET',
//    path: '/playlist/{playlistId}',
//    handler: function (request, reply) {
//        const params = {
//            auth: oauth2Client,
//            part: 'snippet',
//            playlistId: request.params.playlistId
//        };
//
//        youtube.playlistItems.list(params, function (err, data) {
//            if (err) {
//                return reply(err);
//            }
//            return reply(data);
//        });
//    }
//});
//
///**
// * body = {videoId: string}
// */
//server.route({
//    method: 'POST',
//    path: '/playlist/{playlistId}/items',
//    handler: function (request, reply) {
//        const params = {
//            auth: oauth2Client,
//            part: 'snippet',
//            resource: {
//                snippet: {
//                    playlistId: request.params.playlistId,
//                    resourceId: {
//                        kind: 'youtube#video',
//                        videoId: request.payload.videoId
//                    }
//                }
//            }
//        };
//
//        youtube.playlistItems.insert(params, function (err, data) {
//            if (err) {
//                return reply(err);
//            }
//
//            //Note - to watch video , redirect to youtube.com/watch?v=<id>
//            //youtube.com/watch?v=-Fulz4ytZ54
//            return reply(data);
//        });
//    }
//});
//
//server.route({
//    method: 'POST',
//    path: '/slack/youtube/add/{playlistId}',
//    handler: function (request, reply) {
//        //parse payload text - holy shit this is horrendous string parsing (splits).
//        // TODO refactor to use regex like a real programmer
//        console.log('payload...', request.payload);
//        const text = (request.payload.text).split('add');
//        if(text.length >= 2) {
//            const words = text[1].split('v=');
//            console.log('words...', words);
//            const id = ((words[1].split('&'))[0]).split('>')[0];
//            console.log('id...', id);
//            const params = {
//                auth: oauth2Client,
//                part: 'snippet',
//                resource: {
//                    snippet: {
//                        playlistId: request.params.playlistId,
//                        resourceId: {
//                            kind: 'youtube#video',
//                            videoId: id
//                        }
//                    }
//                }
//            };
//
//            youtube.playlistItems.insert(params, function (err, data) {
//                if (err) {
//                    console.log('err..', err)
//                    return reply(err);
//                }
//
//                //Note - to watch video , redirect to youtube.com/watch?v=<id>
//                //youtube.com/watch?v=-Fulz4ytZ54
//                console.log('data..', data);
//                return reply(data);
//            });
//        } else {
//            return reply('not able to add');
//        }
//    }
//});
