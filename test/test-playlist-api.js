'use strict';

const chai = require('chai');
const faker = require('faker');
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

        for (let j = 0; j < 3; j++){

            let seedTrackData = [];
            
            for (let k = 0; k < 10; k++) {
                seedTrackData.push(generateTrackData()); 
            }                    

            seedPlaylists.push(generatePlaylistData(seedTrackData, data[i].id));        
        }        
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
    
    for (let i = 0; i < 3; i++){
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
        return tearDownDb()
            .then(closeServer);
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
});

// Playlist endpoints
describe('Playlist API resource', function () {
   
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
            
            return Promise.all(data.map((user) => {                                     
                return chai.request(app)
                    .get('/playlist')      
                    .send(user.id)       
                    .set({
                        'Authorization': `Bearer ${user.authToken}`        
                    })
                    .then((_res) => {                         
                        res = _res;                                                
                        expect(res).to.have.status(200);                
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf.at.least(1);                        
                        return Playlist.count({userID : user.id});
                    })
                    .then((count) => {                        
                        expect(res.body).to.have.lengthOf(count);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }));     
        }); 
        

        it('should return playlists with right fields', function () {                

            let resPlaylist;

            return Promise.all(data.map((user) => {                  
                return chai.request(app)
                    .get('/playlist')      
                    .send({user: {id : user.id}})       
                    .set({
                        'Authorization': `Bearer ${user.authToken}`        
                    })
                    .then((res) => {                              
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf.at.least(1);                    
                        res.body.forEach((playlist) => {
                            expect(playlist).to.be.a('object');
                            expect(playlist).to.include.keys(
                                'userID', 'id', 'title', 'content', 'created');
                        })
                        return res;
                    })
                    .then((res) => {
                        return Promise.all([
                            Playlist.findById(res.body[0].id),
                            res.body[0]
                        ])
                    })
                    .then((data) => {                            
                        const resPlaylist = data[1];
                        const playlist = data[0];                                         

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
            }));
        });
    });

    describe('POST playlist endpoint', function () {

        it('should add a new playlist', function () {

            const newPlaylist = generatePlaylistData();

            return Promise.all(data.map((user) => {
                return chai.request(app)
                    .post('/playlist')
                    .send(newPlaylist)
                    .set({
                        'Authorization': `Bearer ${user.authToken}`        
                    })
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
            }));            
        });
    });

    describe('PUT playlist endpoint', function () {

        it('should update fields you send over', function () {

            const updateData = {
                title: faker.random.words(),                                
            };            

            return Promise.all(data.map((user) => {
                return Playlist
                    .findOne()
                    .then(function (playlist) {
                        updateData.id = playlist.id;                        
                        return chai.request(app)
                            .put(`/playlist/${playlist.id}`)
                            .set({
                                'Authorization': `Bearer ${user.authToken}`        
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
            }));            
        });
    });

    describe('DELETE playlist endpoint', function () {

        it('should delete a playlist by id', function () {

            let playlist;

            return Promise.all(data.map((user) => {
                return Playlist
                    .findOne()
                    .then(function (_playlist) {
                        playlist = _playlist;
                        return chai.request(app)
                            .delete(`/playlist/${playlist.id}`)
                            .set({
                                'Authorization': `Bearer ${user.authToken}`        
                            })
                        })
                        .then(function (res) {
                            expect(res).to.have.status(204);
                            return Playlist.findById(playlist.id);
                        })
                        .then(function (_playlist) {
                            expect(_playlist).to.be.null;
                        });
            }));            
        });
    });
});

// EXPORT HELPER FUNCTIONS

module.exports = {tearDownDb, generateTrackData, seedData};