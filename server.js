'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 9004
});

server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {

        return reply('hello world');
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});