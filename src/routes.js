var Pages = require('./controllers/pages');
var Authentication = require('./controllers/authentication');
var Api = require('./controllers/api');


/**
 * Contains the list of all routes, i.e. methods, paths and the config functions
 * that take care of the actions
 */
exports.endpoints = {
    frontend: [
        {method: 'GET', path: '/', config: Pages.index},
        {method: 'GET', path: '/about', config: Pages.about},
        {method: 'GET', path: '/login', config: Pages.login},
        {method: 'GET', path: '/register', config: Pages.register},
        {method: 'GET', path: '/profile', config: Pages.profile},
        {method: 'GET', path: '/youtube/playlists', config: Pages.youtubePlaylists},
        {method: 'GET', path: '/youtube/playlist/{playlistId}', config: Pages.youtubePlaylistById},
        {method: 'POST', path: '/youtube/playlist/{playlistId}/items', config: Pages.youtubePlaylistAddItem},
        {method: 'POST', path: '/slack/youtube/add/{playlistId}', config: Pages.slackAddToYoutube},

        {method: 'POST', path: '/login', config: Authentication.login},
        {method: 'GET', path: '/logout', config: Authentication.logout},
        {method: 'POST', path: '/register', config: Authentication.register},

        {method: 'GET', path: '/youtube', config: Authentication.youtube},
        {method: 'GET', path: '/youtube/oauthcallback', config: Authentication.youtubeOAuth}
    ],
    backend: [
        {method: 'POST', path: '/api/login', config: Api.login},
        {method: 'GET', path: '/api/status', config: Api.status}
    ]
};

//backend.route({
//    method: 'GET',
//    config: {auth: 'jwt'},
//    path: '/status',
//    handler: function (request, reply) {
//        reply({text: 'You used a Token!'})
//            .header("Authorization", request.headers.authorization);
//    }
//});

//backend.route({
//    method: 'POST',
//    path: '/login',
//    handler: function (request, reply) {
//        User.authenticate()(request.payload.email, request.payload.password, function (err, user, passwordError) {
//            console.log('in handler /login');
//            // There has been an error, do something with it. I just print it to console for demo purposes.
//            if (err) {
//                console.error(err);
//                return reply.redirect('/login');
//            }
//
//            // Something went wrong with the login process, could be any of:
//            // https://github.com/saintedlama/passport-local-mongoose#error-messages
//            if (passwordError) {
//                // For now, just show the error and login form
//                console.log(passwordError);
//                return reply.view('login', {errors: [passwordError.message]});
//            }
//
//            // If the authentication failed user will be false. If it's not false, we store the user
//            // in our session and redirect the user to the hideout
//            if (user) {
//                var token = JWT.sign(user, 'supersecretkey');
//                return reply({message: 'welcome', token: token});
//            } else {
//                reply('Authentiction failed. Please check credentials and retry');
//            }
//        });
//    }
//});