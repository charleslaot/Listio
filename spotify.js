// authenticate - return token

//{400 401 if bad token / 200 OK} search(searchTerm, token)

const retry = require('retry');
const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const clientID = '1ee741ccb75d4d068181e7ec60222852';
const clientSECRET = '57bf8033f6284c62b63ff98d1a2eea4f';
const query = JSON.stringify(req.query);
var token = '';

function getTrackOptions(token) {
    const trackOptions = {
        url: SPOTIFY_SEARCH_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
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
        request(getTrackOptions(token), function (error, response, body) {

            if (response.statusCode === 200) {
                console.log('---- 200 OK tracks received');
                resolve(response.statusCode);
            } else if ((JSON.parse(body).error.message === "The access token expired") ||
                (response.statusCode === 400 || 401)) {
                console.log('Expired or empty token:', token);
                resolve(response.statusCode);
            } else {
                console.log('oops, something went wrong');
                reject(JSON.parse(body).error.message);
            }
        });
    });
};

function requestToken() {
    console.log('inside req tokens');
    return new Promise((resolve, reject) => {
        request(TokenOptions, function (error, response, body) {

            if (response.statusCode === 200) {
                token = body.access_token;
                console.log('----- 200 OK  token generated');
                console.log('token =', token);
                resolve(token)
            } else {
                console.log('oops, the token was not generated correctly');
                reject();
            }
        });
    });
};


function searchSpotify(searchTerm, token) {
    var operation = retry.operation();
    operation.attempt(function(currentAttempt) {
        requestTracks(searchTerm, token).catch((err) => {
          if (operation.retry(err)) {
            return;            
          }
          operation.mainError();        
        //   cb(err ? operation.mainError() : null, addresses);
        });
      };
};



