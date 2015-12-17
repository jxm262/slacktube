var Pages = require('./controllers/pages');
var Authentication = require('./controllers/authentication');

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: Pages.index
    },
    {
        method: 'GET',
        path: '/about',
        config: Pages.about
    },
    {
        method: 'GET',
        path: '/login',
        config: Pages.login
    },
    {
        method: 'GET',
        path: '/register',
        config: Pages.register
    },
    {
        method: 'GET',
        path: '/profile',
        config: Pages.profile
    },
    {
        method: 'GET',
        path: '/youtube/playlists',
        config: Pages.youtubePlaylists
    },
    {
        method: 'GET',
        path: '/youtube/playlist/{playlistId}',
        config: Pages.youtubePlaylistById
    },
    {
        method: 'POST',
        path: '/youtube/playlist/{playlistId}/items',
        config: Pages.youtubePlaylistAddItem
    },
    {
        method: 'POST',
        path: '/slack/youtube/add/{playlistId}',
        config: Pages.slackAddToYoutube
    },
    {
        method: 'POST',
        path: '/login',
        config: Authentication.login
    },
    {
        method: 'GET',
        path: '/logout',
        config: Authentication.logout
    },
    {
        method: 'POST',
        path: '/register',
        config: Authentication.register
    },
    {
        method: 'GET',
        path: '/youtube',
        config: Authentication.youtube
    },
    {
        method: 'GET',
        path: '/youtube/oauthcallback',
        config: Authentication.youtubeOAuth
    }
];