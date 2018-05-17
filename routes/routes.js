var express = require('express');
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

module.exports = router;
