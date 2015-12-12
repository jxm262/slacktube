'use strict';

const Hapi = require('hapi');
const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');
const config = require('../config');
const google = require('googleapis');
var Routes = require('./routes');
const youtube = google.youtube('v3');
const OAuth2Client = google.auth.OAuth2;
const oauth2Client = new OAuth2Client(config.google.CLIENT_ID, config.google.CLIENT_SECRET, config.google.REDIRECT_URL);
const server = new Hapi.Server();


require('babel-core/register')({
    presets: ['react', 'es2015']
});

server.connection({
    host: config.server.hostname,
    port: config.server.port
});

server.register([require('hapi-auth-cookie'), require('vision')], function (err) {

    if (err) {
        throw err;
    }

    // Set our strategy
    server.auth.strategy('session', 'cookie', {
        password: 'worldofwalmart', // cookie secret
        cookie: 'session', // Cookie name
        isSecure: false, // required for non-https applications
        ttl: 24* 60 * 60 * 1000 // Set session to 1 day
    });

    // Set our view engine, we'll use handlebars
    //server.views({
    //    engines: {
    //        html: require('handlebars')
    //    },
    //    path: __dirname + '/views'
    //});

    server.views({
        engines: {
            jsx: HapiReactViews
        },
        relativeTo: __dirname,
        path: 'views'
    });

});

// Print some information about the incoming request for debugging purposes
server.ext('onRequest', function (request, reply) {
    console.log(request.path, request.query);
    return reply.continue();
});

server.route(Routes.endpoints);

// Start the server
server.start(function() {
    console.log("The server has started on port: " + server.info.port);
});

//server.register(Vision, (err) => {
//
//    if (err) {
//        console.log('Failed to load vision.');
//    }
//
//
//
//    server.views({
//        engines: {
//            jsx: HapiReactViews
//        },
//        relativeTo: __dirname,
//        path: 'views'
//    });
//
//    server.route({
//        method: 'GET',
//        path: '/',
//        handler: (request, reply) => {
//            reply.view('home');
//        }
//    });
//
//    server.route({
//        method: 'GET',
//        path: '/about',
//        handler: (request, reply) => {
//
//            reply.view('about');
//        }
//    });
//
//    server.route({
//        method: 'GET',
//        path: '/login',
//        handler: (request, reply) => {
//            const url = oauth2Client.generateAuthUrl({
//                access_type: 'offline', // will return a refresh token
//                scope: 'https://www.googleapis.com/auth/youtube'
//            });
//
//            return reply.redirect(url);
//        }
//    });
//
//
//    server.route({
//        method: 'GET',
//        path: '/oauthcallback',
//        handler: (request, reply) => {
//            const code = request.query.code;
//
//            oauth2Client.getToken(code, function (err, tokens) {
//                //TODO persist the user and the tokens
//                oauth2Client.setCredentials(tokens);
//                return reply.view('oauthcallback', {tokens: tokens});
//            });
//        }
//    });
//
//    server.route({
//        method: 'GET',
//        path: '/playlists',
//        handler: (request, reply) => {
//            const params = {
//                auth: oauth2Client,
//                part: 'snippet',
//                mine: true
//            };
//
//            youtube.playlists.list(params, function (err, data) {
//                if (err) {
//                    return reply(err);
//                }
//
//                return reply.view('playlists', data);
//            });
//        }
//    });
//
//    server.route({
//        method: 'GET',
//        path: '/playlist/{playlistId}',
//        handler: (request, reply) => {
//            const params = {
//                auth: oauth2Client,
//                part: 'snippet',
//                playlistId: request.params.playlistId
//            };
//
//            youtube.playlistItems.list(params, function (err, data) {
//                if (err) {
//                    return reply(err);
//                }
//                return reply.view('playlist', data);
//            });
//        }
//    });
//
//    /**
//     * body = {videoId: string}
//     */
//    server.route({
//        method: 'POST',
//        path: '/playlist/{playlistId}/items',
//        handler: function (request, reply) {
//            const params = {
//                auth: oauth2Client,
//                part: 'snippet',
//                resource: {
//                    snippet: {
//                        playlistId: request.params.playlistId,
//                        resourceId: {
//                            kind: 'youtube#video',
//                            videoId: request.payload.videoId
//                        }
//                    }
//                }
//            };
//
//            youtube.playlistItems.insert(params, function (err, data) {
//                if (err) {
//                    return reply(err);
//                }
//
//                //Note - to watch video , redirect to youtube.com/watch?v=<id>
//                //youtube.com/watch?v=-Fulz4ytZ54
//                return reply(data);
//            });
//        }
//    });
//
//    server.route({
//        method: 'POST',
//        path: '/slack/youtube/add/{playlistId}',
//        handler: (request, reply) => {
//            //parse payload text - holy shit this is horrendous string parsing (splits).
//            // TODO refactor to use regex like a real programmer
//            const text = (request.payload.text).split('add');
//            if (text.length >= 2) {
//                const words = text[1].split('v=');
//                const id = ((words[1].split('&'))[0]).split('>')[0];
//                const params = {
//                    auth: oauth2Client,
//                    part: 'snippet',
//                    resource: {
//                        snippet: {
//                            playlistId: request.params.playlistId,
//                            resourceId: {
//                                kind: 'youtube#video',
//                                videoId: id
//                            }
//                        }
//                    }
//                };
//
//                youtube.playlistItems.insert(params, function (err, data) {
//                    if (err) {
//                        console.log('err..', err)
//                        return reply(err);
//                    }
//
//                    //Note - to watch video , redirect to youtube.com/watch?v=<id>
//                    //youtube.com/watch?v=-Fulz4ytZ54
//                    console.log('data..', data);
//                    return reply(data);
//                });
//            } else {
//                return reply('not able to add');
//            }
//        }
//    });
//
//    server.start((err) => {
//        if (err) {
//            throw err;
//        }
//        console.log('Server running at:', server.info.uri);
//    });
//});