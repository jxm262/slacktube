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
    //,{
    //    method: 'GET',
    //    path: '/api/redirect',
    //    config: authentication.youtubeEnable
    //}
    ,{
        method: 'GET',
        path: '/api/youtube/playlists',
        config: youtube.playlists
    }
    //,{
    //    method: 'GET',
    //    path: '/youtube/playlist/{playlistId}',
    //    config: pages.youtubePlaylistById
    //}
    //,{
    //    method: 'POST',
    //    path: '/youtube/playlist/{playlistId}/items',
    //    config: pages.youtubePlaylistAddItem
    //}
];