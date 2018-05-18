var express = require('express');
const request = require('request');
var router = express.Router();

router.get('/', function(req, res){  
  res.render('home', {
    title: 'Home'
  });
});

router.get('/login', function(req, res){
    res.render('login', {
      title: 'Log In Page'
    });
});

router.get('/signup', function(req, res){
    res.render('signup', {
      title: 'Sign Up Page'
    });
});

router.get('/login', function(req, res){
    res.render('login', {
      title: 'LogIn Page'
    });
});

router.get('/edit', function(req, res){
    res.render('edit', {
      title: 'Create or Edit Playlist Page'
    });
});

router.get('/access_token', function(req, res){  

  let options = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      headers: {
          Authorization:
            'Basic MWVlNzQxY2NiNzVkNGQwNjgxODFlN2VjNjAyMjI4NTI6NTdiZjgwMzNmNjI4NGM2MmI2M2ZmOThkMWEyZWVhNGY='
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
    };            

  function callback(error, response, body) {        
      if (!error && response.statusCode == 200) {            
          res.send(body.access_token);
        }
  }

  request(options, callback);
  
});


module.exports = router;
