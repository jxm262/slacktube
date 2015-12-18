var proxyquire = require('proxyquire').noCallThru();
//const Mongoose = require('../../../src/models/user');

const chai = require("chai")
const sinon = require("sinon")
const should = chai.should();

describe('youtube controller', function () {
    var sandbox, youtube;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        youtube = proxyquire("../../../src/backend/controllers/youtube", {
            '../../models/user': sandbox.stub()
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('playlist', function () {
        it('should use jwt auth scheme', function () {
            youtube.playlists.auth.should.equal('jwt');
        });
    });
});