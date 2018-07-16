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

// 

function seedData() {
    console.info('seeding data');   

    return Promise.resolve()
    .then(() => {
        return generateUserData();
    }).then((userData) => {
        return registerUser(userData);        
    }).then((userData) => {
        // console.log('----------------------', userData);
        // seedData(userData);
        // return generateAuthTokens(userData);
    });
};



    // const seedPlaylists = [];    
    // const userData = generateUserData();
    // const authTokens = [];

    // for (let i = 0; 1 < 3; i++) {        

    //     userData.push(generateUserCredentials());        
    //     authTokens.push(generateUserTokens(userData[i]));
                
    //     for (let i = 1; i <= 5; i++) {
            
    //         let seedTrackData = [];
            
    //         for (let i = 1; i <= 10; i++) {
    //             seedTrackData.push(generateTrackData()); 
    //         }        

    //         seedPlaylists.push(generatePlaylistData(seedTrackData, userData[i].id));        
    //     }    

    // }
    // return Promise.resolve().then(() => {
    //     Playlist.insertMany(seedPlaylists);
    // }).then(() => {
    //     return authTokens;
    // }); 
// };

function registerUser(Data) {

    var userData = Data;    

    for (let i = 0; i < userData.length; i++){

        let options = {
            url: 'http://localhost:8080/api/users/',
            method: 'POST',
            data: userData[i]
        };

        request(options, (response, body) => {
            console.log('BODY ---- -- -- --', body);
        });

        // return chai.request(app)
        // .post('/api/users/')
        // .send(userData[i])
        // .then((_res) => {
        //     return _res.body;
        // });
    };

    return userData;
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



// describe('User creation and authentication', function () {

//     before(function () {
//         return runServer(TEST_DATABASE_URL);
//     });    
    
//     after(function () {
//         tearDownDb();
//         return closeServer();
//     }); 
    
//     let userRegCredentials = generateUserCredentials();

//     describe('registering a user', function () {
//         it('should return the user id', function () {

//             let res;                

//             return chai.request(app)
//             .post('/api/users/')
//             .send(userRegCredentials)
//             .then((_res) => {                    
//                 res = _res;
//                 expect(res).to.have.status(201);
//                 expect(res.body).to.be.a('object');
//                 expect(res.body).to.include.key('id');
//                 expect(res.body.id).to.have.lengthOf.at.least(1);
//             });     
//         });
//     });

//     describe('authenticate a user', function () {
//         it('should return an authentication token', function () {

//             let res;            
//             let userAuthCredentials = {
//                 username: userRegCredentials.email,
//                 password: userRegCredentials.password
//             };                
            
//             return chai.request(app)
//             .post('/api/auth/login')
//             .send(userAuthCredentials)
//             .then((_res) => {
//                 res = _res;                        
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.a('object');
//                 expect(res.body).to.include.key('authToken');
//                 expect(res.body.authToken).to.have.lengthOf.at.least(1);                    
//             });            
//         });
//     });
// });

describe('Playlist API resource', function () {
    
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    
    beforeEach(function () {        
        return seedData();
    });
    
    afterEach(function () {
        return tearDownDb();
    });
    
    after(function () {
        return closeServer();
    });   
    
      
    describe('GET playlist endpoint', function () {
        
        it('should return all existing playlists', function () {
            
            // let res;
            
            // return chai.request(app)
            // .get('/playlist')             
            // .then(function (_res) {
            //         res = _res;
            //         expect(res).to.have.status(200);

            //         expect(res.body).to.have.lengthOf.at.least(1);
            //         return Playlist.count();
            //     })
            //     .then(function (count) {
            //         expect(res.body).to.have.lengthOf(count);
            //     });
        });

        // it('should return playlists with right fields', function () {

        //     let resPlaylist;

        //     return chai.request(app)
        //         .get('/playlist')
        //         .then(function (res) {
        //             expect(res).to.have.status(200);
        //             expect(res).to.be.json;
        //             expect(res.body).to.be.a('array');
        //             expect(res.body).to.have.lengthOf.at.least(1);

        //             res.body.forEach(function (playlist) {
        //                 expect(playlist).to.be.a('object');
        //                 expect(playlist).to.include.keys(
        //                     'title', 'content', 'created');
        //             });
        //             resPlaylist = res.body[0];
        //             return Playlist.findById(resPlaylist.id);
        //         })
        //         .then(function (playlist) {
        //             expect(resPlaylist.title).to.equal(playlist.title);                    
        //             for (let i = 0; i < playlist.content.length; i++) {                        
        //                 expect(resPlaylist.content[i].songTitle).to.equal(playlist.content[i].songTitle);
        //                 expect(resPlaylist.content[i].songArtist).to.equal(playlist.content[i].songArtist);
        //                 expect(resPlaylist.content[i].songAlbum).to.equal(playlist.content[i].songAlbum);
        //                 expect(resPlaylist.content[i].releaseDate).to.equal(playlist.content[i].releaseDate.toISOString());
        //                 expect(resPlaylist.content[i].duration).to.equal(playlist.content[i].duration);
        //                 expect(resPlaylist.content[i].thumbnail).to.equal(playlist.content[i].thumbnail);
        //                 expect(resPlaylist.content[i].explicit).to.equal(playlist.content[i].explicit);
        //                 expect(resPlaylist.content[i].preview).to.equal(playlist.content[i].preview);
        //                 expect(resPlaylist.content[i].popularity).to.equal(playlist.content[i].popularity);
        //             }
        //             expect(resPlaylist.created).to.equal(playlist.created.toISOString());
        //         });
        // });

    });

    // describe('POST playlist endpoint', function () {

    //     it('should add a new playlist', function () {

    //         const newPlaylist = generatePlaylistData();

    //         return chai.request(app)
    //             .post('/playlist')
    //             .send(newPlaylist)
    //             .then(function (res) {
    //                 expect(res).to.have.status(201);
    //                 expect(res).to.be.json;
    //                 expect(res.body).to.be.a('object');
    //                 expect(res.body.id).to.not.be.null;
    //                 expect(res.body).to.include.keys('title');
    //                 expect(res.body.title).to.equal(newPlaylist.title);                                        
    //                 return Playlist.findById(res.body.id);
    //             })
    //             .then(function (playlist) {                                        
    //                 expect(newPlaylist.title).to.equal(playlist.title);                                        
    //             });
    //     });
    // });

    // describe('PUT playlist endpoint', function () {

    //     it('should update fields you send over', function () {
    //         const updateData = {
    //             title: faker.random.words(),                                
    //         };

    //         return Playlist
    //             .findOne()
    //             .then(function (playlist) {
    //                 updateData.id = playlist.id;

    //                 return chai.request(app)
    //                     .put(`/playlist/${playlist.id}`)
    //                     .send(updateData);
    //             })
    //             .then(function (res) {
    //                 expect(res).to.have.status(204);
    //                 return Playlist.findById(updateData.id);
    //             })
    //             .then(function (playlist) {
    //                 expect(playlist.id).to.equal(updateData.id);
    //                 expect(playlist.title).to.equal(updateData.title);
    //             });
    //     });
    // });


    // describe('DELETE playlist endpoint', function () {

    //     it('delete a playlist by id', function () {

    //         let playlist;

    //         return Playlist
    //             .findOne()
    //             .then(function (_playlist) {
    //                 playlist = _playlist;
    //                 return chai.request(app).delete(`/playlist/${playlist.id}`);
    //             })
    //             .then(function (res) {
    //                 expect(res).to.have.status(204);
    //                 return Playlist.findById(playlist.id);
    //             })
    //             .then(function (_playlist) {
    //                 expect(_playlist).to.be.null;
    //             });
//         });
//     });
});