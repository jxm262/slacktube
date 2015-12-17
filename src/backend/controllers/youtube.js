const Joi = require('joi');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const google = require('googleapis');
const youtube = google.youtube('v3');
const User = require('../../models/user');
const config = require('../../../config');
const oauth2Client = require('../../../config/oauth2Client');

exports.playlists = {
    auth: 'jwt',
    handler: (request, reply) => {
        const id = request.auth.credentials._id;

        User.findById(id, function (err, user) {
            if (err) {
                reply({error: err});
            }

            const tokens = user.youtube;

            if (_.isEmpty(tokens)){
                return reply({error: 'missing google oauth token. Please enable youtube in the website first'});
            }

            oauth2Client.setCredentials(tokens);

            const params = {
                auth: oauth2Client,
                part: 'snippet',
                mine: true
            };

            youtube.playlists.list(params, function (err, resp) {
                if (err) {
                    return reply({error: err});
                }

                return reply(resp);
            });
        });
    }
};


///**
// * POST /api/register creates a new user.
// * @param {string} email
// * @param {password} string
// */
//exports.register = {
//    validate: {
//        payload: {
//            email: Joi.string().email().required(),
//            password: Joi.string().required()
//        }
//    },
//    handler: function (request, reply) {
//        const newUser = new User({
//            email: request.payload.email
//        });
//
//        // The register function has been added by passport-local-mongoose and takes as first parameter
//        // the user object, as second the password it has to hash and finally a callback with user info.
//        User.register(newUser, request.payload.password, function (err, user) {
//            if (err) {
//                return reply({error: err});
//            }
//
//            const userData = {
//                _id: user._id,
//                email: user.email,
//                creationDate: user.creationDate
//            };
//
//            return reply({status: 'SUCCESS', user: userData});
//        });
//    }
//};
//
//
///**
// * POST /api/login logs the user in
// * @param {string} email
// * @param {password} string
// */
//exports.login = {
//    handler: function (request, reply) {
//        User.authenticate()(request.payload.email, request.payload.password, function (err, user, passwordError) {
//            // There has been an error, do something with it. I just print it to console for demo purposes.
//            if (err) {
//                return reply({error: err});
//            }
//
//            // Something went wrong with the login process, could be any of:
//            // https://github.com/saintedlama/passport-local-mongoose#error-messages
//            if (passwordError) {
//                // For now, just show the error and login form
//                return reply({errors: [passwordError.message]});
//            }
//
//            // If the authentication failed user will be false. If it's not false, we store the user
//            // in our session and redirect the user to the hideout
//            if (user) {
//                const token = JWT.sign(
//                    {
//                        _id: user._id,
//                        agent: request.headers['user-agent']
//                    },
//                    config.jwt.key
//                    //,{expiresIn: '3 days'}    //todo do we need expiry
//                );
//
//                return reply({user: {email: request.payload.email}, token: token});
//            } else {
//                reply('Authentiction failed. Please check credentials and retry');
//            }
//        });
//    }
//};
//
//exports.status = {
//    auth: 'jwt',
//    handler: function (request, reply) {
//        reply({text: 'You used a Token!'})
//            .header("Authorization", request.headers.authorization);
//    }
//};