'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('root point of app', function () {

    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    it('should return status 200', function () {

        return chai.request(app)
            .get('/')
            .then(function (response) {
                expect(response).to.have.status(200);
            })         
    })
})