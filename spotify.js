// authenticate - return access_token

//{400 401 if bad access_token / 200 OK} search(searchTerm, access_token)

const retry = require('retry');
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

const TokenOptions = {
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
                (response.statusCode === 400 || 401)) {
                console.log('Expired or empty access_token:', access_token);
                reject(response.statusCode);
            } else {
                console.log('oops, something went wrong');
                reject(JSON.parse(body).error.message);
            }
        });
    });
};

function requestToken() {
    request(TokenOptions, function (error, response, body) { 
        if (response.statusCode === 200) {            
            access_token = body.access_token;
            console.log('access_token generated');
            console.log('access_token =', access_token);            
          } else {
            console.log('oops, the token was not generated correctly');            
          }
    });
};

function searchTrack(searchTerm) {    
    
    var operation = retry.operation();

    operation.attempt(function (currentAttempt) {
        requestTracks(searchTerm)
            .then((result) => {
                console.log('----- Success');  
                console.log(result);
                return result;
            }).catch((err) => {                
                requestToken();
                operation.retry(err);
            });
    });
};

module.exports = {searchTrack};