const google = require('googleapis');
const oauth2Client = require('../../config/oauth2Client');
const User = require('../models/user');
const youtube = google.youtube('v3');

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
                    return reply(err);
                }
                
                return reply(resp);
            });
        });
    }
};

/**
 * GET /youtube/playlists shows youtube playlist by id
 */
exports.youtubePlaylistById = {
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
};

/**
 * POST /youtube/playlists adds youtube video by videoId
 * @param {string} request.params.playlistId playlistId to insert to
 * @param {string} request.payload.videoId
 */
exports.youtubePlaylistAddItem = {
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
};


/**
 * POST /slack/youtube/add/{playlistId} parses input and adds youtube video by keywords `add <youtube_link>`
 * @param {string} request.payload.text text prop from Slack outgoing webhook POST, in form of `add <youtube_link>`
 */
exports.slackAddToYoutube = {
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
};
