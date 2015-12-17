const pages = require('./controllers/pages');
const authentication = require('./controllers/authentication');

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: pages.index
    },
    {
        method: 'GET',
        path: '/about',
        config: pages.about
    },
    {
        method: 'GET',
        path: '/login',
        config: pages.login
    },
    {
        method: 'GET',
        path: '/register',
        config: pages.register
    },
    {
        method: 'GET',
        path: '/profile',
        config: pages.profile
    },
    {
        method: 'GET',
        path: '/youtube/playlists',
        config: pages.youtubePlaylists
    },
    {
        method: 'GET',
        path: '/youtube/playlist/{playlistId}',
        config: pages.youtubePlaylistById
    },
    {
        method: 'POST',
        path: '/youtube/playlist/{playlistId}/items',
        config: pages.youtubePlaylistAddItem
    },
    {
        method: 'POST',
        path: '/slack/youtube/add/{playlistId}',
        config: pages.slackAddToYoutube
    },
    {
        method: 'POST',
        path: '/login',
        config: authentication.login
    },
    {
        method: 'GET',
        path: '/logout',
        config: authentication.logout
    },
    {
        method: 'POST',
        path: '/register',
        config: authentication.register
    },
    {
        method: 'GET',
        path: '/youtube/enable',
        config: authentication.youtube
    },
    {
        method: 'GET',
        path: '/youtube/oauthcallback',
        config: authentication.youtubeOAuth
    }
];