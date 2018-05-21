const express = require('express');
const request = require('request');
const router = express.Router();




router.get('/', function (req, res) {
  res.render('home', {
    title: 'Home'
  });
});

router.get('/login', function (req, res) {
  res.render('login', {
    title: 'Log In Page'
  });
});

router.get('/signup', function (req, res) {
  res.render('signup', {
    title: 'Sign Up Page'
  });
});

router.get('/login', function (req, res) {
  res.render('login', {
    title: 'LogIn Page'
  });
});

router.get('/edit', function (req, res) {
  res.render('edit', {
    title: 'Create or Edit Playlist Page'
  });
});






















router.get('/get_track', function (req, res) {

  const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token';
  const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
  const clientID = '1ee741ccb75d4d068181e7ec60222852';
  const clientSECRET = '57bf8033f6284c62b63ff98d1a2eea4f';
  const query = JSON.stringify(req.query);


  
  // var expiredAccessToken = 'BQAff3wwlD76SbHm3pj-2c95GtgNUi5Lq8YfC8TQUCK2-UASFvjjo0xpToEMaF29gyoKuOSfyHK-VXphgBk';  

  var token = '';




  function getTrackOptions(access_token){
    var trackOptions = {
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

  const getTokenOptions = {
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





  
  
   getTrack = new Promise(
    function requestTracks(resolve, reject) {
      request(getTrackOptions(token), function (error, response, body) {
        if (response.statusCode === 200) {
          console.log('---- 200 OK tracks received');
          resolve(JSON.parse(body));
        } else if ((JSON.parse(body).error.message === "The access token expired") &&
          (response.statusCode === 401)) {
          console.log('Bad token');
          reject(JSON.parse(body).error.message);            
        } else {
          console.log('oops, something went wrong');
          reject(JSON.parse(body).error.message);
        }
      });   
    });


  function requestToken() {
    request(getTokenOptions, function (error, response, body) {     
      if (response.statusCode === 200) {
        token = body.access_token;               
        console.log('----- 200 OK  token generated'); 
        console.log('token =', token);
      } else {
        console.log('oops, something went wrong the token was not generated correctly');                    
      }   
    });
    
  }
  
  
  
  getTrack.then(
    function (data) {      
      console.log('promise resolved - data:', data);     
    }).catch(
      function (error) {
        console.log('promise rejected');        
        console.log('getting new access token');
        requestToken();                  
      } 
    )
    .then(
      function(){
        console.log('third promise');
      }
    );
    
    



});

module.exports = router;