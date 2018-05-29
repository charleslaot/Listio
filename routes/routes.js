'use strict'

const path = require('path');
const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const spotify = require('../spotify');
const {Playlist} = require('../models');

const router = express.Router();
mongoose.Promise = global.Promise;

router.get('/', function (req, res) {
  res.sendFile('home.html', {
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

router.get('/edit', function (req, res) {
  res.sendFile('edit.html', {
    "root": './views'
  });
});


router.post('/create', (req, res) => {  
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
      title: req.body.title      
    })
    .then(playlist => res.status(201).json(playlist.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong'
      });
    });

});


router.get('/read', (req, res) => {
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

router.get('/edit/:name', (req, res) => {
  Playlist
  .findOne({title : req.params.name})
  .then(playlist => {
    res.json(playlist.serialize()
  )})
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went horribly wrong'});
  });
});


router.put('/update/:id', (req, res) => {
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


router.delete('/delete/:id', (req, res) => {
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

router.get('/track/:track_name', function (req, res) {
  spotify.searchTrack(req.params.track_name)
    .then(function (data) {
      res.json(data);
    });

});

module.exports = router;