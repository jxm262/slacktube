'use strict';

const _ = require('lodash');
const google = require('googleapis');
const youtube = google.youtube('v3');
const User = require('../../models/user');
const config = require('../../../config');
const oauth2Client = require('../../../config/oauth2Client');


module.exports = {

    /**
     * GET
     * /api/youtube/playlists
     * shows all youtube playlists for user
     */
    playlists: {
        auth: 'jwt',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;

            User.findById(id, (err, user) => {
                if (err) {
                    reply({error: err});
                }

                const tokens = user.youtube;

                if (_.isEmpty(tokens)) {
                    return reply({error: 'missing google oauth token. Please enable youtube in the website first'});
                }

                oauth2Client.setCredentials(tokens);

                const params = {
                    auth: oauth2Client,
                    part: 'snippet',
                    mine: true
                };

                youtube.playlists.list(params, (err, resp) => {
                    if (err) {
                        return reply({error: err});
                    }

                    return reply(resp);
                });
            });
        }
    },

    /**
     * GET
     * /api/youtube/playlist/{playlistId}
     * shows youtube playlist by id
     */
    playlistById: {
        auth: 'jwt',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;

            User.findById(id, (err, user) => {
                if (err) {
                    return reply({error: err});
                }

                const tokens = user.youtube;

                if (_.isEmpty(tokens)) {
                    return reply({error: 'missing google oauth token. Please enable youtube in the website first'});
                }

                oauth2Client.setCredentials(tokens);

                const params = {
                    auth: oauth2Client,
                    part: 'snippet',
                    playlistId: request.params.playlistId
                };

                youtube.playlistItems.list(params, (err, resp) => {
                    if (err) {
                        return reply({error: err});
                    }

                    return reply(resp);
                });
            });
        }
    },

    /**
     * POST
     * /api/youtube/playlist/{playlistId}/items
     * adds an item into a given playlist
     *
     * @param {string} request.params.playlistId playlistId to insert to
     * @param {string} request.payload.videoId
     */
    addPlaylistItem: {
        auth: 'jwt',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;

            User.findById(id, (err, user) => {
                if (err) {
                    return reply({error: err});
                }

                const tokens = user.youtube;

                if (_.isEmpty(tokens)) {
                    return reply({error: 'missing google oauth token. Please enable youtube in the website first'});
                }

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

                youtube.playlistItems.insert(params, (err, data) => {
                    if (err) {
                        return reply({error: err});
                    }

                    //Note - to watch video , redirect to youtube.com/watch?v=<id>
                    //youtube.com/watch?v=-Fulz4ytZ54
                    return reply(data);
                });
            });
        }
    },

    /**
     * POST
     * /api/youtube/playlists
     * adds an item into a given playlist
     *
     * @param {object} snippet
     * @param {string} snippet.title
     * @param {string=} snippet.description
     * @param {string=} status.privacyStatus
     * @param {array=} snippet.tags[]
     * @param {string=} snippet.defaultLanguage
     * @param {string=} localizations.(key)
     * @param {string=} localizations.(key).title
     * @param {string=} localizations.(key).description
     */
    addPlaylist: {
        auth: 'jwt',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;
            const body = request.payload;

            User.findById(id, (err, user) => {
                if (err) {
                    return reply({error: err});
                }

                const tokens = user.youtube;

                if (_.isEmpty(tokens)) {
                    return reply({error: 'missing google oauth token. Please enable youtube in the website first'});
                }

                oauth2Client.setCredentials(tokens);

                const params = {
                    auth: oauth2Client,
                    part: 'snippet',
                    resource: {
                        snippet: body
                    }
                };

                youtube.playlists.insert(params, (err, data) => {
                    if (err) {
                        return reply({error: err});
                    }

                    //Note - to watch video , redirect to youtube.com/watch?v=<id>
                    //youtube.com/watch?v=-Fulz4ytZ54
                    return reply(data);
                });
            });
        }
    }
};
