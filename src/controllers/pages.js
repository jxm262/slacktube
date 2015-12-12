
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
 * GET /login shows the login page.  Redirects to /profile if already logged in
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
 * GET /register shows registration form.  Redirects to /profile if already logged in
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
