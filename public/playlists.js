'use strict';

// CONTROL LOGIC

function emit(event, payload) {  
  console.log(event);  

  switch (event) {

    case 'added':
    case 'deleted':
      getPlaylists();        
      break;

    case 'fetched':      
      displayPlaylists(payload);
      break;

    case 'error':      
      console.log(payload);    
      break;
  };  
};

function request(method, url, body){
  return Promise.resolve()
  .then(() => {
    const settings = {
      url: url,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`        
      },
      dataType: 'json', 
      type: method,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(body)
    };
    return $.ajax(settings);  
    })
  .catch(err => {
    emit('error', err);
  });
};

// PLAYLISTS FUNCTIONS

// Fetch all playlists
function getPlaylists() {  
    request('GET', '/playlist')  
      .then((results) => {
        emit('fetched', results);      
      }); 
};

// Create playlist
function createPlaylist() {
  $('.js-PlaylistForm').submit(event => {
    event.preventDefault();
    let playlistName = $(event.currentTarget).find('.js-newPlaylistName').val();
    $('.js-newPlaylistName').val('');
    request('POST', '/playlist', {title: playlistName})  
      .then(() => {
        emit('added'); 
      });
  });
};

// Delete playlist
function deletePlaylist(){
  $('.js-all-playlist').on('submit', 'form.delete', function (event) {
    event.preventDefault();    
    let deletePlaylistURL = event.target.action;
    request('DELETE', deletePlaylistURL)  
      .then((results) => {
        emit('deleted');      
      });   
  });
}

// RENDER

function displayPlaylists(data) {
  return new Promise((resolve, reject) => {
    let results = data.map((item) => renderPlaylists(item)).reverse();
    $('.js-all-playlists').html(results);
    resolve()
    .catch(err => {
      emit('error', err);
    });
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

// ON PAGE LOAD

function onPageLoad() {  
  getPlaylists()
  createPlaylist();  
  deletePlaylist();
};

$(onPageLoad);