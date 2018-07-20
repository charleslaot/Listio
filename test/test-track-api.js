'user strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {
    TEST_DATABASE_URL
} = require('../config');
const {
    Playlist
} = require('../playlists/models');
const {
    app,
    runServer,
    closeServer
} = require('../server');
const {
    tearDownDb,
    generateTrackData,
    seedData
} = require('./test-playlist-api');

const expect = chai.expect;
chai.use(chaiHttp);

// TESTING

// Tracks endpoints
describe('Track API resource', function () {

    var data;

    beforeEach(function () {
        return runServer(TEST_DATABASE_URL)
            .then(seedData)
            .then((userData) => {
                data = userData;
            });
    });

    afterEach(function () {
        return tearDownDb()
            .then(closeServer)
    });

    describe('GET track endpoint', function () {

        console.log(data);

        it('should return all tracks in a playlists', function () {

            let res;
            let playlist;

            return Promise.all(data.map((user) => {
                return Playlist
                    .findOne()
                    .then(function (_playlist) {
                        playlist = _playlist;
                        return chai.request(app)
                            .get(`/playlist/${playlist.id}/tracks`)
                            .set({
                                'Authorization': `Bearer ${user.authToken}`
                            })
                    })
                    .then(function (_res) {
                        res = _res;
                        expect(res).to.have.status(200);
                        expect(res).to.be.a('object');
                        expect(res.body.content).to.have.lengthOf.at.least(1);
                        return Playlist.find({
                            _id: playlist.id
                        })
                    })
                    .then((playlist) => {
                        return playlist[0].content.length;
                    })
                    .then(function (count) {
                        expect(res.body.content).to.have.lengthOf(count);
                    });
            }));
        });
    });

    describe('POST track endpoint', function () {

        it('should add a new track to playlist', function () {

            let newTrack = generateTrackData();

            return Promise.all(data.map((user) => {
                return Playlist
                    .findOne()
                    .then(function (playlist) {
                        return chai.request(app)
                            .post(`/playlist/${playlist.id}/track`)
                            .send(newTrack)
                            .set({
                                'Authorization': `Bearer ${user.authToken}`
                            })
                    })
                    .then(function (res) {
                        expect(res).to.have.status(204);
                    });
            }));
        });
    });

    describe('DELETE track endpoint', function () {

        it('should delete a track in a playlist', function () {

            return Promise.all(data.map((user, index) => {

                return Playlist
                    .findOne()
                    .then(function (playlist) {
                        let trackID = playlist.content[index].id;
                        return chai.request(app)
                            .delete(`/playlist/${playlist.id}/track/${trackID}`)
                            .set({
                                'Authorization': `Bearer ${user.authToken}`
                            })
                    })
                    .then(function (res) {
                        expect(res).to.have.status(204);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }));
        });
    });

    describe('GET search track endpoint', function () {

        it('should fetch a new track', function () {

            let newSearchTrack = ['Clocks', 'Nothing Else Matters', 'Queen']

            return Promise.all(data.map((user, index) => {
                return chai.request(app)
                    .get(`/track/${newSearchTrack[index]}`)
                    .set({
                        'Authorization': `Bearer ${user.authToken}`
                    })
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                    });
            }));
        });
    });
});