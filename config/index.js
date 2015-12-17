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
        username: '',
        password: '',
        url: '',
        database: ''
    },
    jwt: {
        key: ''
    },
    server: {
        hostname: '',
        port: 8080
    },
    google: {
        CLIENT_ID: '',
        CLIENT_SECRET: '',
        REDIRECT_URL: ''
    }
};
