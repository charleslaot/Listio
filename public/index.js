'use strict'

const CREATE_PLAYLIST_URI = 'http://localhost:8080/create/';
const GET_PLAYLIST_URI = 'http://localhost:8080/read/';
const EDIT_PLAYLIST_URI = 'http://localhost:8080/edit/';

// Create a playlist
$('.js-createPlaylistForm').submit(event => {
  event.preventDefault();
  let playlistName = $(event.currentTarget).find('.js-newPlaylistName').val();
  createPlaylist(playlistName)
    .then(getAllPlaylist)
    .then(displayAllPlaylist);
});

// Show/edit a playlist
$('.js-all-playlists').on('click', '.js-itemPlaylist', function(playlistName) {
  getOnePlaylist(playlistName)
    .then(displayOnePlaylist);      
  });  


function getOnePlaylist(playlist){
  return new Promise((resolve, reject) => {
      var playlistURL = EDIT_PLAYLIST_URI + playlist.target.textContent;        
      const settings = {
        url: playlistURL,    
        dataType: 'json',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',    
      };    
      resolve($.ajax(settings));     
    });
  };  

function createPlaylist(listName) {  
  return new Promise((resolve, reject) => {    
    const settings = {
      url: CREATE_PLAYLIST_URI,
      data: JSON.stringify({title: listName}),
      dataType: 'json',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',    
    };    
    $.ajax(settings);     
    resolve();
  });  
};

function getAllPlaylist() {
  return new Promise((resolve, reject) => {
    const settings = {
      url: GET_PLAYLIST_URI,    
      dataType: 'json',
      type: 'GET',
      contentType: 'application/json; charset=utf-8',    
    };
    let results = $.ajax(settings);            
    resolve(results)
  });    
};

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

function renderOnePlaylists(playlist) {  
  return `      
      <div>                         
        <p>Title: <span class="itemPlaylist js-itemPlaylist">${playlist.title}</span></p>                
        <p>Created: ${playlist.created}</p>                        
      </div>
    `;
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

function renderSongs(result) {
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

function onPageLoad() {
  getAllPlaylist()
    .then(displayAllPlaylist);
  
}

$(onPageLoad());