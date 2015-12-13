const google = require('googleapis');
const oauth2Client = require('../../config/oauth2Client');
const User = require('../models/user');

/**
 * Handles a call to / and shows some text with links to login and registration
 */
exports.index = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        const user = (request.auth.isAuthenticated)
            ? {user: request.auth.credentials}
            : null;
        
        return reply.view('home', user);
    }
};

/**
 * GET /about about page
 */
exports.about = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        return reply.view('about', {data: 'some message'});
    }
};

/**
 * GET /login shows the login page.
 * Redirects to /profile if already logged in
 */
exports.login = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/profile');
        }

        return reply.view('login');
    }
};

/**
 * GET /register shows registration form.
 * Redirects to /profile if already logged in
 */
exports.register = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/profile');
        }

        return reply.view('register');
    }
};

/**
 * GET /profile shows profile page
 */
exports.profile = {
    auth: 'session',
    handler: function (request, reply) {
        return reply.view('profile', {user: request.auth.credentials});
    }
};

/**
 * GET /youtube/playlists shows youtube playlists
 */
exports.youtubePlaylists = {
    auth: 'session',
    handler: (request, reply) => {

        console.log('request.auth.credentials', request.auth);
        //User.findById()


        //TODO: set credentials from user in db
        //const tokens = null;
        //oauth2Client.setCredentials(tokens);
        //
        //const params = {
        //    auth: oauth2Client,
        //    part: 'snippet',
        //    mine: true
        //};
        //
        //youtube.playlists.list(params, function (err, data) {
        //    if (err) {
        //        return reply(err);
        //    }
        //
        //    return reply.view('playlists', data);
        //});
    }
};
