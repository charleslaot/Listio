'use strict'

const PLAYLIST_URI = 'https://nameless-springs-69015.herokuapp.com/playlist/';

// Dev channel
// const PLAYLIST_URI = 'http://localhost:8080/playlist/';

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
function displayOnePlaylist(data) {
    return new Promise((resolve, reject) => {
        console.log(data);
        let results = renderOnePlaylists(data);
        $('.js-one-playlists').html(results);
        resolve();
    });
};

function renderOnePlaylists(playlist) {
    console.log('renderOnePlaylists', playlist);
    return `      
        <div>                         
          <p>Title: <span class="itemPlaylist js-itemPlaylist">${playlist.title}</span></p>                
          <p>Created: ${playlist.created}</p> 
          <p>Songs: ${playlist.content}</p>
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

// When page loads handler
function onPageLoad() {
    console.log("object");
    // getOnePlaylist()
    //     .then(displayOnePlaylist);
}

$(onPageLoad());