const youtube = require("../../../src/backend/controllers/youtube")
const chai = require("chai")
const sinon = require("sinon")
const should = chai.should();

describe('youtube controller', function () {
    describe('playlist', function () {
        it('should use jwt auth scheme', function () {
            youtube.playlists.auth.should.equal('jwt');
        });
    });
});