'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const spotify = require('./spotify');
const {Playlist} = require('./models');

mongoose.Promise = global.Promise;
router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', {session: false});

// STATIC RESOURCES

router.get('/', function (req, res) {     
  res.sendFile('index.html', {
    "root": './views'
  });
});

router.get('/playlists', (req, res) => {     
  res.sendFile('playlists.html', {
    "root": './views'
  });
});

router.get('/login', (req, res) => {
  res.sendFile('login.html', {
    "root": './views'
  });
});

router.get('/signup', (req, res) => {
  res.sendFile('signup.html', {
    "root": './views'
  });
});

router.get('/playlist/:id', (req, res) => {
  res.sendFile('edit.html', {
    "root": './views'
  });
});


// PLAYLISTS ENDPOINTS

// Fetch all playlists
router.get('/playlist', jwtAuth, (req, res) => {    
  Playlist
    .find({userID : req.user.id})
    .then(playlists => {
      res.json(playlists.map(playlist => playlist.serialize()));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: 'something went wrong'
      });
    });
});

// Create playlist
router.post('/playlist', jwtAuth, (req, res) => {    
  const requiredFields = ["title"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(req.body) || !(field in req.body)) {
      const message = `Missing \`${field}\` in request body or body is undefined`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Playlist
    .create({
      title: req.body.title,
      userID: req.user.id
    })
    .then(playlist => res.status(201).json(playlist.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong'
      });
    });

});

// Update a playlist
router.put('/playlist/:id', jwtAuth, (req, res) => { 
  const updated = {};
  const updateableFields = ['title'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  Playlist
    .findByIdAndUpdate(req.params.id, {
      $set: updated
    }, {
      new: true
    })
    .then(updatePlaylist => res.status(204).end())
    .catch(err => res.status(500).json({
      message: 'Something went wrong'
    }));
});

// Delete a playlist
router.delete('/playlist/:id', jwtAuth, (req, res) => {
  Playlist
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({
        message: 'success'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went wrong'
      });
    });
});


// TRACKS ENDPOINTS

// Retrieve playlist track list
router.get('/playlist/:id/tracks', jwtAuth, (req, res) => {  

  Playlist
    .findOne({
      _id: req.params.id
    })
    .then(playlist => {      
      res.json(playlist.serialize())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went horribly wrong'
      });
    });
});

// Search track
router.get('/track/:title', jwtAuth, (req, res) => {
  spotify.searchTrack(req.params.title)
    .then(function (data) {
      res.status(200).json(data);
    });

});

// Insert track into playlist
router.post('/playlist/:id/track', jwtAuth, (req, res) => {
  Playlist
    .findByIdAndUpdate(req.params.id, {
      $push: {
        content: req.body
      }
    })
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went wrong'
      });
    });
});

// Delete track from playlist
router.delete('/playlist/:id/track/:trackId', jwtAuth, (req, res) => {
  Playlist
    .findByIdAndUpdate(req.params.id, {
      $pull: {
        content: {songId: req.params.trackId}
    }})           
    .then(() => {
      res.status(204)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went wrong'
      });
    });
});

module.exports = {router};
