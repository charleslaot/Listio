'use strict'

// const PLAYLIST_URI = 'https://nameless-springs-69015.herokuapp.com/playlist/';

// Dev channel
const PLAYLIST_URI = 'http://localhost:8080/playlist/';

// Create playlist handler
$('.js-addPlaylistForm').submit(event => {
  event.preventDefault();
  let playlistName = $(event.currentTarget).find('.js-newPlaylistName').val();
  $('.js-newPlaylistName').val('');
  createPlaylist(playlistName)
    .then(getPlaylists)
    .then(displayPlaylists);
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
    resolve();
  });
};

// Get all playlists
function getPlaylists() {
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

// Render functions
function displayPlaylists(data) {
  return new Promise((resolve, reject) => {
    let results = data.map((item) => renderAllPlaylists(item)).reverse();
    $('.js-all-playlists').html(results);
    resolve();
  });
};

function renderAllPlaylists(playlist) {
  return `
      <br>      
      <div>                         
        <p>Title: <a href="/edit/${playlist.title}"><span class="itemPlaylist js-itemPlaylist">${playlist.title}</span></p></a>
        <p>Created: ${playlist.created}</p>                        
      </div>
    `;
};

// When page loads handler
function onPageLoad() {
  getPlaylists()
    .then(displayPlaylists);
}

$(onPageLoad());