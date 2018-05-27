'use strict'

const promiseRetry = require('promise-retry');
const request = require('request');
const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const clientID = '1ee741ccb75d4d068181e7ec60222852';
const clientSECRET = '57bf8033f6284c62b63ff98d1a2eea4f';
var access_token = '';

function getTrackOptions(searchTerm, access_token) {
    const trackOptions = {
        url: SPOTIFY_SEARCH_URL,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        qs: {
            q: `${searchTerm}`,
            type: 'track',
            limit: '10'
        }
    };
    return trackOptions;
};

const tokenOptions = {
    url: SPOTIFY_API_TOKEN_URL,
    method: 'POST',
    headers: {
        Authorization: 'Basic ' + new Buffer(`${clientID}:${clientSECRET}`).toString('base64')
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

function requestTracks(searchTerm) {
    return new Promise((resolve, reject) => {
        request(getTrackOptions(searchTerm, access_token), function (error, response, body) {

            if (response.statusCode === 200) {
                console.log('200 OK tracks received');
                resolve(body);
            } else if ((JSON.parse(body).error.message === "The access access_token expired") ||
                (response.statusCode === 400 || response.statusCode === 401)) { //refactor
                console.log('Expired or empty access_token:', access_token);
                requestToken().then(function () {
                    reject();
                });
            } else {
                console.log('oops, something went wrong');
                reject(JSON.parse(body).error.message);
            }
        });
    });
};

function requestToken() {
    return new Promise((resolve, reject) => {
        request(tokenOptions, function (error, response, body) {
            if (response.statusCode === 200) {
                access_token = body.access_token;
                console.log('access_token generated');
                console.log('access_token =', access_token);
                resolve();
            } else {
                console.log('oops, the token was not generated correctly');
                reject();
            }
        });
    });
};

function searchTrack(searchTerm) {

    return promiseRetry(function (retry, number) {
            console.log('attempt number', number);

            return requestTracks(searchTerm)
                .catch(retry);
            })
            .then(function (result) {
                return JSON.parse(result);
            }, function (err) {
                // ..
            });
};

module.exports = {searchTrack};