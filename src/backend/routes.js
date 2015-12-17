const authentication = require('./controllers/authentication');
const youtube = require('./controllers/youtube');

module.exports = [
    {
        method: 'POST',
        path: '/api/register',
        config: authentication.register
    }
    ,{
        method: 'POST',
        path: '/api/login',
        config: authentication.login
    }
    ,{
        method: 'GET',
        path: '/api/status',
        config: authentication.status
    }
    ,{
        method: 'GET',
        path: '/api/youtube/playlists',
        config: youtube.playlists
    }
    ,{
        method: 'GET',
        path: '/api/youtube/playlist/{playlistId}',
        config: youtube.playlistById
    }
    ,{
        method: 'POST',
        path: '/api/youtube/playlist/{playlistId}/items',
        config: youtube.addPlaylistItem
    }
];