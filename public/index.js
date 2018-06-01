'use strict'

const PLAYLIST_URI = 'http://https://nameless-springs-69015.herokuapp.com/playlist/';

// Dev channel
// const PLAYLIST_URI = 'http://localhost:8080/playlist/';

// Create playlist handler
$('.js-createPlaylistForm').submit(event => {
  event.preventDefault();
  let playlistName = $(event.currentTarget).find('.js-newPlaylistName').val();
  createPlaylist(playlistName)
    .then(getAllPlaylist)
    .then(displayAllPlaylist);
});

// Show/edit playlist handler
$('.js-all-playlists').on('click', '.js-itemPlaylist', function (playlistName) {
  getOnePlaylist(playlistName)
    .then(displayOnePlaylist);
});

// Create playlist
function createPlaylist(listName) {
  return new Promise((resolve, reject) => {
    const settings = {
      url: PLAYLIST_URI,
      data: JSON.stringify({
        title: listName
      }),
      dataType: 'json',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
    };
    $.ajax(settings);

    // *** add error handler here ***

    resolve();
  });
};

// Get all playlists
function getAllPlaylist() {
  return new Promise((resolve, reject) => {
    const settings = {
      url: PLAYLIST_URI,
      dataType: 'json',
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
    };
    let results = $.ajax(settings);
    resolve(results)
  });
};

// Get one playlist
function getOnePlaylist(playlist) {
  return new Promise((resolve, reject) => {
    var playlistURL = PLAYLIST_URI + playlist.target.textContent;
    const settings = {
      url: playlistURL,
      dataType: 'json',
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
    };
    let results = $.ajax(settings);
    resolve(results)
  });
};

// Render functions
function displayAllPlaylist(data) {
  return new Promise((resolve, reject) => {
    let results = data.map((item) => renderAllPlaylists(item)).reverse();
    $('.js-all-playlists').html(results);
    resolve();
  });
};

function displayOnePlaylist(data) {
  return new Promise((resolve, reject) => {
    let results = renderOnePlaylists(data);
    $('.js-one-playlists').html(results);
    resolve();
  });
};

function renderAllPlaylists(playlist) {
  return `
      <br>      
      <div>                         
        <p>Title: <span class="itemPlaylist js-itemPlaylist">${playlist.title}</span></p>                
        <p>Created: ${playlist.created}</p>                        
      </div>
    `;
};

function renderOnePlaylists(playlist) {
  return `      
      <div>                         
        <p>Title: <span class="itemPlaylist js-itemPlaylist">${playlist.title}</span></p>                
        <p>Created: ${playlist.created}</p>                        
      </div>
    `;
};

function renderTracks(result) {
  return `
      <br>      
      <div>                 
        <img src='${result.album.images[2].url}'>
        <p>Song: ${result.name}</p>        
        <p>Artist: ${result.album.artists[0].name}</p>        
        <p>Album: ${result.album.name}</p>                        
      </div>
    `;
};

// When page loads
function onPageLoad() {
  getAllPlaylist()
    .then(displayAllPlaylist);
}

$(onPageLoad());