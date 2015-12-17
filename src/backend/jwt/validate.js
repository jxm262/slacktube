var User = require('../../models/user');

module.exports = function (decodedToken, request, callback) {
    User.findById(decodedToken._id, function (err, user) {
        const isAuth = (err) ? false : true;
        callback(null, isAuth);
    });
};