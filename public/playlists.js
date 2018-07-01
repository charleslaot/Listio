'use strict';

const DATA = {
  results: [],
  playlist: []
};

function emit(event, payload) {
  console.log(event, payload);
  switch (event) {
    case 'add':
      console.log('added');
      
      break;
    case 'delete':
      console.log('deleted');
      
      break;
    case 'edit':
      console.log('edited');
      
      break;
    case 'fetch':
      console.log('fetched');      

  }
  //render();
}

// Playlist handlers
function playlistHandler() {
  deletePlaylist();
};

// Playlist handler
$('.js-PlaylistForm').submit(event => {
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
      url: '/playlist',
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
      url: '/playlist',
      dataType: 'json',
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
    };
    let results = $.ajax(settings);
    resolve(results)
  });
};

// Delete playlist
function deletePlaylist(){
  $('.js-all-playlist').on('submit', 'form.delete', function (event) {
    event.preventDefault();    
    let deletePlaylistURL = event.target.action;
    const settings = {
        url: deletePlaylistURL,
        dataType: 'json',
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
    };
    $.ajax(settings);
}); 
}

// Render functions
function displayPlaylists(data) {
  return new Promise((resolve, reject) => {
    let results = data.map((item) => renderPlaylists(item)).reverse();
    $('.js-all-playlists').html(results);
    resolve();
  });
};

function renderPlaylists(playlist) {
  return `
      <br>      
      <div>                         
        <p>Title: <a href="/playlist/${playlist.id}"><span class="itemPlaylist js-itemPlaylist">${playlist.title}</span></p></a>
        <p>Created: ${playlist.created}</p>    
        <form class="delete" action="/playlist/${playlist.id}">
            <button class='js-deletePlaylistBtn' type="submit">Delete Playlist</button>
        </form>                    
      </div>
    `;
};

// When page loads handler
function onPageLoad() {
  getPlaylists()
    .then(displayPlaylists);

  playlistHandler();
}

$(onPageLoad());