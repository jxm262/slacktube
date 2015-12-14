'use strict';

const Hapi = require('hapi');
const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');
const config = require('../config');
const google = require('googleapis');
var Routes = require('./routes');
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
        path: 'views',
        compileOptions: {
            doctype: '<!DOCTYPE html>',
            renderMethod: 'renderToString'
        }
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
