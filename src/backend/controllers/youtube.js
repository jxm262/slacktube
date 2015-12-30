'use strict';

const _ = require('lodash');
const google = require('googleapis');
const youtube = google.youtube('v3');
const User = require('../../models/user');
const config = require('../../../config');
const Promise = require('bluebird');
const oauth2Client = require('../../../config/oauth2Client');

const validateTokens = user =>
    _.isEmpty(user.youtube)
        ? Promise.reject({error: 'missing google oauth token. Please enable youtube in the website first'})
        : Promise.resolve(user.youtube);

const setCredentials = tokens => {
    oauth2Client.setCredentials(tokens);
    return Promise.resolve(oauth2Client);
};

const replyErr = (err, reply) =>
    (err.code)
        ? reply({errors: err.errors}).code(403)
        : reply(err).code(404);

Promise.promisifyAll(youtube.playlists);
Promise.promisifyAll(youtube.playlistItems);

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

            User.findByIdAsync(id)
                .then(validateTokens)
                .then(setCredentials)
                .then(auth => Promise.resolve({
                        auth: auth,
                        part: 'snippet',
                        mine: true
                    })
                )
                .then(youtube.playlists.listAsync)
                .then(reply)
                .catch(e => replyErr(e, reply));
        }
    },

    /**
     * GET
     * /api/youtube/playlist/{playlistId}
     * shows youtube playlist by id
     *
     * @param {string} request.params.id
     */
    playlistById: {
        auth: 'jwt',
        handler: (request, reply) => {
            const id = request.auth.credentials._id;

            User.findByIdAsync(id)
                .then(validateTokens)
                .then(setCredentials)
                .then(auth => Promise.resolve({
                        auth: auth,
                        part: 'snippet',
                        playlistId: request.params.playlistId
                    })
                )
                .then(youtube.playlistItems.listAsync)
                .then(reply)
                .catch(e => replyErr(e, reply));
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

            User.findByIdAsync(id)
                .then(validateTokens)
                .then(setCredentials)
                .then(auth => Promise.resolve({
                        auth: auth,
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
                    })
                )
                .then(youtube.playlistItems.insertAsync)
                .then(reply)
                .catch(e => replyErr(e, reply));
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

            User.findByIdAsync(id)
                .then(validateTokens)
                .then(setCredentials)
                .then(auth => Promise.resolve({
                        auth: auth,
                        part: 'snippet',
                        resource: {
                            snippet: body.snippet
                        }
                    })
                )
                .then(youtube.playlists.insertAsync)
                .then(reply)
                .catch(e => replyErr(e, reply));
        }
    }
};
