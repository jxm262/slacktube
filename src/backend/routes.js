var Api = require('./controllers/api');

module.exports = [
    {
        method: 'POST',
        path: '/api/login',
        config: Api.login
    },
    {
        method: 'GET',
        path: '/api/status',
        config: Api.status
    }
];