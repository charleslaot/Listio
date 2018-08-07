'use strict';

// CONTROL LOGIC

function emit(event, payload) {  
  console.log(event);  

  switch (event) {

    case 'added':      
      location.href=`/playlist/${payload.id}`;
      break;

    case 'edited':
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
      .then((playlist) => {
        emit('added', playlist); 
      });
  });
};

// Edit Playlist Name
function editPlaylist(){
  $('.js-all-playlists').on('click', '.fa-edit', function (event){  
    event.preventDefault();      
    $(this).hide();
    $('.delete-playlist-btn').hide();
    $(this.closest('.js-playlist-name'))      
      .replaceWith(`
        <form class="form-edit" action="#">          
          <input type="text" class="form-control edit-playlist-name js-editPlaylistName" placeholder="New Name" required>          
          <button type="submit" class="btn btn-success">
            <span class='edit-label'>Submit</span>
          </button>
        </form>
      `);
  });  

  $('.js-all-playlists').on('submit', '.form-edit', function (event) {
    event.preventDefault();    
    let newPlaylistName = $(event.currentTarget).find('.js-editPlaylistName').val();     
    let editPlaylistID = event.target.parentElement.id;    
    request('PUT', `/playlist/${editPlaylistID}`, {title: newPlaylistName})  
      .then(() => {
        emit('edited'); 
      });
  });
};



// Delete playlist
function deletePlaylist(){
  $('.js-all-playlists').on('submit', '.form-delete', function (event) {    
    event.preventDefault();        
    let deletePlaylistID = event.target.parentElement.id;     
    request('DELETE', `/playlist/${deletePlaylistID}`)  
      .then((results) => {
        emit('deleted');      
      });   
  });
};

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
  <div class="playlist-item" id=${playlist.id}>                         
    <h2 class="js-playlist-name">
      <a href="/playlist/${playlist.id}">
        <span class="js-itemPlaylist">${playlist.title}</span>
      </a>
      <i class="fas fa-edit"></i>
    </h2>
    <h5>${playlist.content.length} Songs</h5>
    <h6>Created: ${playlist.created}</h6>    
    <form class="form-delete" action="#">
      <button class='btn btn-success delete-playlist-btn js-deletePlaylistBtn' type="submit">
        <span class="delete-label">Delete</span>
      </button>
    </form>                    
  </div>
  `;
};

// ON PAGE LOAD

function onPageLoad() {  
  getPlaylists();
  createPlaylist();  
  editPlaylist();  
  deletePlaylist();
};

$(onPageLoad);