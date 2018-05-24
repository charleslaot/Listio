// authenticate - return access_token

//{400 401 if bad access_token / 200 OK} search(searchTerm, access_token)

const retry = require('retry');
const request = require('request');
const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/access_token';
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const clientID = '1ee741ccb75d4d068181e7ec60222852';
const clientSECRET = '57bf8033f6284c62b63ff98d1a2eea4f';
var access_token = '';

function getTrackOptions(access_token) {
    const trackOptions = {
        url: SPOTIFY_SEARCH_URL,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        qs: {
            q: 'clocks',
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

function requestTracks() {
    console.log('inside req tracks');
    return new Promise((resolve, reject) => {
        request(getTrackOptions(access_token), function (error, response, body) {

            if (response.statusCode === 200) {
                console.log('---- 200 OK tracks received');
                resolve(response.statusCode);
            } else if ((JSON.parse(body).error.message === "The access access_token expired") ||
                (response.statusCode === 400 || 401)) {
                console.log('Expired or empty access_token:', access_token);
                resolve(response.statusCode);
            } else {
                console.log('oops, something went wrong');
                reject(JSON.parse(body).error.message);
            }
        });
    });
};

// function requestToken() {
//     console.log('inside req tokens');
//     return new Promise((resolve, reject) => {
//         request(TokenOptions, function (error, response, body) {

//             if (response.statusCode === 200) {
//                 access_token = body.access_token;
//                 console.log('----- 200 OK  access_token generated');
//                 console.log('access_token =', access_token);
//                 resolve(access_token)
//             } else {
//                 console.log('oops, the access_token was not generated correctly');
//                 reject();
//             }
//         });
//     });
// };


function requestToken() {
        console.log('inside req tokens');
        request(TokenOptions, function (error, response, body) {

            if (response.statusCode === 200) {
                access_token = body.access_token;
                console.log('----- 200 OK  access_token generated');
                console.log('access_token =', access_token);
                return access_token;
            } else {
                console.log('oops, the access_token was not generated correctly');
                return;
            }
        });
    };
    

exports.searchTrack = function (searchTerm) {        
    
    var operation = retry.operation({
        retries:10,
        minTimeout: 10 * 1000,
        maxTimeout: 30 * 1000
    });

    operation.attempt(function(currentAttempt) {
        requestTracks(searchTerm, access_token)
            .then((data) =>{
                console.log('Attempt:', currentAttempt);
                return;
            })
            .catch(err => {
                console.log('catch error', err);
                console.log('Bttempt:', currentAttempt);
                return;
        })
            
    });
};