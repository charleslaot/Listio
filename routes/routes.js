'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const spotify = require('../spotify');
const {
  Playlist
} = require('../models');

mongoose.Promise = global.Promise;

// Server static resources
router.get('/', function (req, res) {
  res.sendFile('index.html', {
    "root": './views'
  });
});

router.get('/login', function (req, res) {
  res.sendFile('login.html', {
    "root": './views'
  });
});

router.get('/signup', function (req, res) {
  res.sendFile('signup.html', {
    "root": './views'
  });
});

router.get('/playlist/:id', function (req, res) {
  res.sendFile('edit.html', {
    "root": './views'
  });
});

// Playlist endpoints

// Create playlist
router.post('/playlist', (req, res) => {
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
      userId: req.body.title
    })
    .then(playlist => res.status(201).json(playlist.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong'
      });
    });

});

// Retrieve all playlists
router.get('/playlist', (req, res) => {
  Playlist
    .find()
    .then(playlists => {
      res.json(playlists.map(playlist => playlist.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went wrong'
      });
    });
});


// Update a playlist
router.put('/playlist/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
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
router.delete('/playlist/:id', (req, res) => {
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


// Tracks endpoints

// Retrieve playlist track list
router.get('/playlist/:id/tracks', (req, res) => {  

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
router.get('/track/:title', function (req, res) {
  spotify.searchTrack(req.params.title)
    .then(function (data) {
      res.json(data);
    });

});

// Insert track into playlist
router.post('/playlist/:id/track', function (req, res) {
  Playlist
    .findByIdAndUpdate(req.params.id, {
      $push: {
        content: req.body
      }
    })
    .then(
      res.end()
    );
});

// Delete track from playlist
router.delete('/playlist/:id/track/:trackId', function (req, res) {
  Playlist
    .findByIdAndUpdate(req.params.id, {
      $pull:{content: {songId: req.params.trackId}}})           
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

module.exports = router;
