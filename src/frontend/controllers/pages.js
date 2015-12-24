'use strict';

const google = require('googleapis');
const youtube = google.youtube('v3');
const User = require('../../models/user');
const oauth2Client = require('../../../config/oauth2Client');

module.exports = {

    /**
     * Handles a call to / and shows some text with links to login and registration
     */
    index: {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        handler: function (request, reply) {

            //TODO make some middleware to parse the user from the request, doing it in React component for now
            //const user = (request.auth.isAuthenticated)
            //    ? {user: {email: request.auth.credentials.email, youtube: request.auth.credentials.youtube}}
            //    : null;

            return reply.view('home', {user: request.auth});
        }
    },

    /**
     * GET /about about page
     */
    about: {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        handler: function (request, reply) {
            return reply.view('about', {data: 'some message'});
        }
    },

    /**
     * GET /login shows the login page.
     * Redirects to /profile if already logged in
     */
    login: {
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
    },

    /**
     * GET /register shows registration form.
     * Redirects to /profile if already logged in
     */
    register: {
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
    },

    /**
     * GET /profile shows profile page
     */
    profile: {
        auth: 'session',
        handler: function (request, reply) {
            return reply.view('profile', {user: request.auth.credentials});
        }
    },

    /**
     * GET /youtube/playlists shows youtube playlists
     */
    youtubePlaylists: {
        auth: 'session',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;
            User.findById(id, function (err, user) {
                if (err) {
                    //TODO handle error
                    console.log(err);
                }

                const tokens = user.youtube;
                oauth2Client.setCredentials(tokens);

                const params = {
                    auth: oauth2Client,
                    part: 'snippet',
                    mine: true
                };

                youtube.playlists.list(params, function (err, resp) {
                    if (err) {
                        console.log('error from google', err);
                        return reply(err);
                    }

                    return reply(resp);
                });
            });
        }
    },

    /**
     * GET /youtube/playlists shows youtube playlist by id
     */
    youtubePlaylistById: {
        auth: 'session',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;
            User.findById(id, function (err, user) {
                if (err) {
                    //TODO handle error
                    console.log(err);
                }

                const tokens = user.youtube;
                oauth2Client.setCredentials(tokens);

                const params = {
                    auth: oauth2Client,
                    part: 'snippet',
                    playlistId: request.params.playlistId
                };

                youtube.playlistItems.list(params, function (err, resp) {
                    if (err) {
                        return reply(err);
                    }

                    return reply(resp);
                });
            });
        }
    },

    /**
     * POST /youtube/playlists adds youtube video by videoId
     * @param {string} request.params.playlistId playlistId to insert to
     * @param {string} request.payload.videoId
     */
    youtubePlaylistAddItem: {
        auth: 'session',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;
            User.findById(id, function (err, user) {
                if (err) {
                    //TODO handle error
                    console.log(err);
                }

                const tokens = user.youtube;
                oauth2Client.setCredentials(tokens);

                const params = {
                    auth: oauth2Client,
                    part: 'snippet',
                    resource: {
                        snippet: {
                            playlistId: request.params.playlistId,
                            resourceId: {
                                kind: 'youtube#video',
                                videoId: request.payload.videoId
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
            });
        }
    },


    /**
     * POST /slack/youtube/add/{playlistId} parses input and adds youtube video by keywords `add <youtube_link>`
     * @param {string} request.payload.text text prop from Slack outgoing webhook POST, in form of `add <youtube_link>`
     */
    slackAddToYoutube: {
        auth: 'session',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;
            User.findById(id, function (err, user) {
                if (err) {
                    //TODO handle error
                    console.log(err);
                }

                const tokens = user.youtube;
                oauth2Client.setCredentials(tokens);

                //parse payload text - holy shit this is horrendous string parsing (splits).
                // TODO refactor to use regex like a real programmer
                const text = (request.payload.text).split('add');
                if (text.length >= 2) {
                    const words = text[1].split('v=');
                    const id = ((words[1].split('&'))[0]).split('>')[0];
                    const params = {
                        auth: oauth2Client,
                        part: 'snippet',
                        resource: {
                            snippet: {
                                playlistId: request.params.playlistId,
                                resourceId: {
                                    kind: 'youtube#video',
                                    videoId: id
                                }
                            }
                        }
                    };

                    youtube.playlistItems.insert(params, function (err, data) {
                        if (err) {
                            console.log('err..', err)
                            return reply(err);
                        }

                        //Note - to watch video , redirect to youtube.com/watch?v=<id>
                        //youtube.com/watch?v=-Fulz4ytZ54
                        console.log('data..', data);
                        return reply(data);
                    });
                } else {
                    return reply('not able to add');
                }
            });
        }
    }
}
