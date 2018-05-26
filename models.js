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

// include in the playlist schema
// const songsSchema = mongoose.Schema({
//     songTitle: {type: String, required: true},
//     songArtist: {type: String, required: true},
//     songAlbum: {type: String, required: true},
//     releaseDate: {type: Date, required: true},
//     duration: {type: Number, required: true},
//     thumbnail: {type: String, required: true},
//     explicit: {type: Boolean, required: true},
//     preview: {type: String, required: true}    
// });
// encodeURIComponent('nothing else matters')

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = {Playlist};