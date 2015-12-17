var Joi = require('joi');
var User = require('../models/user');
const config = require('../../config');
const google = require('googleapis');
const oauth2Client = require('../../config/oauth2Client');

/**
 * POST /login logs the user in
 * @param {string} email
 * @param {password} string
 */
exports.login = {
    handler: function (request, reply) {
        User.authenticate()(request.payload.email, request.payload.password, function (err, user, passwordError) {

            // There has been an error, do something with it. I just print it to console for demo purposes.
            if (err) {
                console.error(err);
                return reply.redirect('/login');
            }

            // Something went wrong with the login process, could be any of:
            // https://github.com/saintedlama/passport-local-mongoose#error-messages
            if (passwordError) {
                // For now, just show the error and login form
                console.log(passwordError);
                return reply.view('login', {errors: [passwordError.message]});
            }

            // If the authentication failed user will be false. If it's not false, we store the user
            // in our session and redirect the user to the hideout
            if (user) {
                request.auth.session.set(user);
            }

            return reply.redirect('/', {user: user});

        });
    }
};

/**
 * GET /logout logs out the user
 */
exports.logout = {
    auth: 'session',
    handler: function (request, reply) {
        request.auth.session.clear();
        reply().redirect('/');
    }
};

/**
 * POST /register creates a new user.
 * @param {string} email
 * @param {password} string
 */
exports.register = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function (request, reply) {
        var newUser = new User({
            email: request.payload.email
        });

        // The register function has been added by passport-local-mongoose and takes as first parameter
        // the user object, as second the password it has to hash and finally a callback with user info.
        User.register(newUser, request.payload.password, function (err, user) {
            // Return error if present
            if (err) {
                return reply(err);
            }

            return reply.redirect('/login');
        });
    }
};

/**
 * GET /youtube redirects to oauth2 url (enable google account page)
 */
exports.youtube = {
    auth: 'session',
    handler: (request, reply) => {
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // will return a refresh token
            scope: 'https://www.googleapis.com/auth/youtube'
        });

        return reply.redirect(url);
    }
};

/**
 * GET /youtube redirects to oauth2 url (enable google account page)
 */
exports.youtubeOAuth = {
    auth: 'session',
    handler: (request, reply) => {
        const code = request.query.code;

        oauth2Client.getToken(code, function (err, tokens) {
            oauth2Client.setCredentials(tokens);

            const query = {_id: request.auth.credentials._id};

            User.findOneAndUpdate(query, {youtube: tokens}, function (err, data) {
                if(err) {
                    console.log('err..', err);
                    //TODO redirect on error
                }

                return reply.redirect('/profile');
            });
        });
    }
};

