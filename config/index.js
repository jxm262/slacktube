/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {
    mongo: {
        username: 'justin',
        password: 'Password1234',
        url: 'localhost:27017',
        database: 'test'
    },
    jwt: {
        key: 'eWzVARvtLsMhfmQGdDGSbb72PP3i4NZ'
    },
    server: {
        hostname: 'localhost',
        port: 9004
    },
    google: {
        CLIENT_ID: '829952237297-d8t8ub8k10vokjofmn27c25ka2a495a8.apps.googleusercontent.com',
        CLIENT_SECRET: 'eWzVARvtLsM-hfmQGPP3i4NZ',
        REDIRECT_URL: 'http://localhost:9004/youtube/oauthcallback'
    }
};
