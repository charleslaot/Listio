'use strict';

const chai = require('chai');
const faker = require('faker');
const request = require('request');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const {Playlist} = require('../playlists/models');
const {TEST_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


// FUNCTIONS HELPERS

function seedData() {    

    return Promise.resolve()
    .then(() => {
        return generateUserData();
    })
    .then((userData) => {
        return registerUser(userData);        
    })
    .then((results) => {                
        return seedAppData(results);        
    })
    .then((data) => { 
        console.log(data);             
       return generateAuthTokens(data);                        
    }); 
};

function generateAuthTokens(data){          

    let users = data[0];

    return Promise.all(users.map((user) => {
        return chai.request(app)
        .post('/api/auth/login')
        .send({
            username: user.email,
            password: user.password
        })
        .then((res) => {   
            user.authToken = res.body.authToken;             
            return user;
        });    
    }));
};

function seedAppData(data){   

    const seedPlaylists = [];        
                
    for (let i = 0; i < data.length; i++) {
        
        let seedTrackData = [];
        
        for (let j = 1; j <= 10; j++) {
            seedTrackData.push(generateTrackData()); 
        }        

        seedPlaylists.push(generatePlaylistData(seedTrackData, data[i].id));        
    }    
    return Playlist.insertMany(seedPlaylists)
    .then((playlist) => {
        let userAndPlaylistData = [data, playlist];
        return userAndPlaylistData;
    });
};

function registerUser(userData) {

    return Promise.all(userData.map((user) => {        
        return chai.request(app)
        .post('/api/users/')
        .send(user)
        .then((_res) => {
            user.id = _res.body.id;
            return user;
        });
    }));
};

function generateUserData() {
    const userData = [];
    
    for (let i = 1; i <= 3; i++){
        userData.push(generateUserCredentials());
    }
    
    return userData;
};

function generateUserCredentials() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

function generatePlaylistData(seedTrack, userId) {
    return {
        userID: userId,
        title: faker.random.words(),
        content: seedTrack,
        created: faker.date.past()
    }
}

function generateTrackData() {     
    return {        
        songTitle: faker.random.words(),
        songArtist: faker.name.firstName(),
        songAlbum: faker.random.words(),
        releaseDate: faker.date.past(),
        duration: faker.random.number(),
        thumbnail: faker.random.image(),
        explicit: faker.random.boolean(),
        preview: faker.internet.url(),
        popularity: faker.random.number()    
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


// TESTING

// User endpoints, creation and auth
describe('User creation and authentication', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });    
    
    after(function () {        
        return closeServer();
    }); 
    
    let userRegCredentials = generateUserCredentials();

    describe('registering a user', function () {
        it('should return the user id', function () {

            let res;                

            return chai.request(app)
            .post('/api/users/')
            .send(userRegCredentials)
            .then((_res) => {                    
                res = _res;
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.key('id');
                expect(res.body.id).to.have.lengthOf.at.least(1);
            });     
        });
    });

    describe('authenticate a user', function () {
        it('should return an authentication token', function () {

            let res;            
            let userAuthCredentials = {
                username: userRegCredentials.email,
                password: userRegCredentials.password
            };                
            
            return chai.request(app)
            .post('/api/auth/login')
            .send(userAuthCredentials)
            .then((_res) => {
                res = _res;                        
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.key('authToken');
                expect(res.body.authToken).to.have.lengthOf.at.least(1);                    
            });            
        });
    });

    tearDownDb();    
});

// Playlist endpoints
describe('Playlist API resource', function () {
   
    var data;
    
    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(seedData)
            .then((userData) => {
                data = userData;
            })
    });       

    afterEach(function () {
        return tearDownDb();
    });
    
    after(function () {
        return closeServer();
    });       
      
    
    describe('GET playlist endpoint', function () {
        
        it('should return a 401 unauthorized user', function(){

            let res;                
            
            return chai.request(app)
            .get('/playlist')                         
            .then(function (_res) {
                res = _res;
                expect(res).to.have.status(401);                                
                })
            .catch(function (err) {
                console.log(err);                
            });        
        });
        
        it('should return all existing playlists', function () {

            let res;   
            console.log(data);
            return chai.request(app)
            .get('/playlist')             
            .set({
                'Authorization': `Bearer ${data[0].authToken}`        
                })
            .then(function (_res) {
                res = _res;
                expect(res).to.have.status(200);
                console.log(res.body);
                expect(res.body).to.have.lengthOf.at.least(1);
                return Playlist.count();
                })
            .then(function (count) {
                expect(res.body).to.have.lengthOf(count);
            });
        }); 
        

        it('should return playlists with right fields', function () {

            return seedData()
            .then((data) => {     

                let resPlaylist;

                return chai.request(app)
                .get('/playlist')
                .set({
                    'Authorization': `Bearer ${data[0].authToken}`        
                })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf.at.least(1);

                    res.body.forEach(function (playlist) {
                        expect(playlist).to.be.a('object');
                        expect(playlist).to.include.keys(
                            'userID', 'title', 'content', 'created');
                    });
                    resPlaylist = res.body[0];
                    return Playlist.findById(resPlaylist.id);
                })
                .then(function (playlist) {
                    expect(resPlaylist.title).to.equal(playlist.title);                    
                    for (let i = 0; i < playlist.content.length; i++) {                        
                        expect(resPlaylist.content[i].songTitle).to.equal(playlist.content[i].songTitle);
                        expect(resPlaylist.content[i].songArtist).to.equal(playlist.content[i].songArtist);
                        expect(resPlaylist.content[i].songAlbum).to.equal(playlist.content[i].songAlbum);
                        expect(resPlaylist.content[i].releaseDate).to.equal(playlist.content[i].releaseDate.toISOString());
                        expect(resPlaylist.content[i].duration).to.equal(playlist.content[i].duration);
                        expect(resPlaylist.content[i].thumbnail).to.equal(playlist.content[i].thumbnail);
                        expect(resPlaylist.content[i].explicit).to.equal(playlist.content[i].explicit);
                        expect(resPlaylist.content[i].preview).to.equal(playlist.content[i].preview);
                        expect(resPlaylist.content[i].popularity).to.equal(playlist.content[i].popularity);
                    }
                    expect(resPlaylist.created).to.equal(playlist.created.toDateString());
                });
            });
        });
    });

    describe('POST playlist endpoint', function () {

        it('should add a new playlist', function () {

            const newPlaylist = generatePlaylistData();

            return seedData()
            .then((data) => {

                return chai.request(app)
                    .post('/playlist')
                    .set({
                        'Authorization': `Bearer ${data[0].authToken}`        
                    })
                    .send(newPlaylist)
                    .then(function (res) {
                        expect(res).to.have.status(201);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('object');
                        expect(res.body.id).to.not.be.null;
                        expect(res.body).to.include.keys('title');
                        expect(res.body.title).to.equal(newPlaylist.title);                                        
                        return Playlist.findById(res.body.id);
                    })
                    .then(function (playlist) {                                        
                        expect(newPlaylist.title).to.equal(playlist.title);                                        
                    });
            });
        });
    });

    describe('PUT playlist endpoint', function () {

        it('should update fields you send over', function () {
            const updateData = {
                title: faker.random.words(),                                
            };

            return seedData()
            .then((data) => {

                return Playlist
                    .findOne()
                    .then(function (playlist) {
                        updateData.id = playlist.id;

                        return chai.request(app)
                            .put(`/playlist/${playlist.id}`)
                            .set({
                                'Authorization': `Bearer ${data[0].authToken}`        
                            })
                            .send(updateData);
                    })
                    .then(function (res) {
                        expect(res).to.have.status(204);
                        return Playlist.findById(updateData.id);
                    })
                    .then(function (playlist) {
                        expect(playlist.id).to.equal(updateData.id);
                        expect(playlist.title).to.equal(updateData.title);
                    });
            });
        });
    });


    describe('DELETE playlist endpoint', function () {

        it('delete a playlist by id', function () {

            let playlist;

            return seedData()
            .then((data) => {

                return Playlist
                    .findOne()
                    .then(function (_playlist) {
                        playlist = _playlist;
                        return chai.request(app)
                        .delete(`/playlist/${playlist.id}`)
                        .set({
                            'Authorization': `Bearer ${data[0].authToken}`        
                        })
                    })
                    .then(function (res) {
                        expect(res).to.have.status(204);
                        return Playlist.findById(playlist.id);
                    })
                    .then(function (_playlist) {
                        expect(_playlist).to.be.null;
                    });
            });
        });
    });
});

// Tracks endpoints
describe('Track API resource', function () {
    
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    
    afterEach(function () {
        return tearDownDb();
    });
    
    after(function () {
        return closeServer();
    });  

    describe('GET track endpoint', function () {
        
        it('should return all tracks in a playlists', function () {
            
            return seedData()
            .then((data) => {            

                let res;
                let playlist;                                
                
                return Playlist
                .findOne()
                .then(function (_playlist){                    
                    playlist = _playlist;                    
                    return chai.request(app)
                    .get(`/playlist/${playlist.id}/tracks`)             
                    .set({
                        'Authorization': `Bearer ${data[0].authToken}`        
                    })
                })
                .then(function (_res) {
                    res = _res;                    
                    expect(res).to.have.status(200); 
                    expect(res).to.be.a('object');                   
                    return Playlist.count();
                    })
                .then(function (count) {
                    // 
                });
            }); 
        });

    });

});