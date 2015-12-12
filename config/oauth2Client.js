const config = require('./config');
const OAuth2Client = google.auth.OAuth2;

module.exports = new OAuth2Client(config.google.CLIENT_ID, config.google.CLIENT_SECRET, config.google.REDIRECT_URL);