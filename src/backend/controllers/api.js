const Joi = require('joi');
const JWT = require('jsonwebtoken');
const google = require('googleapis');
const User = require('../../models/user');
const config = require('../../../config');
const oauth2Client = require('../../../config/oauth2Client');


/**
 * POST /api/login logs the user in
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
                var token = JWT.sign(
                    {
                    _id: user._id,
                    agent: request.headers['user-agent']
                    },
                    config.jwt.key
                    //,{expiresIn: '3 days'}    //todo do we need expiry
                );
                return reply({message: 'welcome', token: token});
            } else {
                reply('Authentiction failed. Please check credentials and retry');
            }
        });
    }
};

exports.status = {
    auth: 'jwt',
    handler: function (request, reply) {
        reply({text: 'You used a Token!'})
            .header("Authorization", request.headers.authorization);
    }
};