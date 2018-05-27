'use strict'

const chai = require('chai');
const {app} = require('../server');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

function testClientRender() {  
    describe('App render endpoints', function () {        

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