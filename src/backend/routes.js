const authentication = require('./controllers/authentication');


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
];