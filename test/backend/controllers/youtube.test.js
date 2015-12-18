'use strict';

const proxyquire = require('proxyquire').noCallThru();
const chai = require("chai")
const sinon = require("sinon")
const should = chai.should();

describe('youtube controller', function () {
    let sandbox, youtube;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        youtube = proxyquire("../../../src/backend/controllers/youtube", {
            '../../models/user': sandbox.stub()
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('playlist', () => {
        it('should use jwt auth scheme', () => {
            youtube.playlists.auth.should.equal('jwt');
        });
    });
});