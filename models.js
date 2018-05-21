'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const playlistSchema = mongoose.Schema({
  title: {type: String, required: true},  
  content: {type: Array, required: true},
  created: {type: Date, default: Date.now}
});

playlistSchema.methods.serialize = function() {
  return {
    id: this._id,        
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const songsSchema = mongoose.Schema({
    songTitle: {type: String, required: true},
    songArtist: {type: String, required: true},
    songAlbum: {type: String, required: true},
    releaseDate: {type: Date, required: true},
    duration: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    explicit: {type: Boolean, required: true},
    preview: {type: String, required: true}    
});

const Playlist = mongoose.model('Playlist', playlistSchema);
const Songs = mongoose.model('Songs', songsSchema);

module.exports = {Playlist, Songs};