'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

function testClientRender() {  
    describe('App render endpoints', function () {
        before(function () {
            return runServer(TEST_DATABASE_URL);
        });

        after(function () {
            return closeServer();
        });

        it('home page should return status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (response) {
                    expect(response).to.have.status(200);
                })
        })

        it('login page should return status 200', function () {
            return chai.request(app)
                .get('/login')
                .then(function (response) {
                    expect(response).to.have.status(200);
                })
        })

        it('sign up page should return status 200', function () {
            return chai.request(app)
                .get('/signup')
                .then(function (response) {
                    expect(response).to.have.status(200);
                })
        })

        it('edit page should return status 200', function () {
            return chai.request(app)
                .get('/edit')
                .then(function (response) {
                    expect(response).to.have.status(200);
                });
        });
    });
};

module.exports = {testClientRender};