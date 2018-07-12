'use strict';

const DATA = {
    results: [],
    playlist: [],
    playlistId: location.pathname.split('/')[2]
};

// CONTROL LOGIC

function emit(event, payload) {
    console.log(event);

    switch (event) {

        case 'search':
            DATA.results = payload;
            displaySearchTracks();
            break;

        case 'add':
            console.log('added');
            break;

        case 'delete':
            console.log('deleted');
            getTracks(DATA.playlistId);
            break;

        case 'fetch':
            console.log('fetched');
            DATA.playlist = payload;
            displayTracks();
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
    .catch((err) => {
        emit('error', err);
    });
};

// TRACK FUNCTIONS

// Fetch all tracks
function getTracks(playlistId) {       
    request('GET', `/playlist/${playlistId}/tracks`)    
    .then((playlist) => {        
        $('.playlist-name').html(`<span>${playlist.title}</span>`);
        emit('fetch', playlist);
    });
};

// Search for tracks
function searchTracks(playlistId) {
    $('.js-tracksForm').submit(event => {
        event.preventDefault();
        let trackName = $(event.currentTarget).find('.js-newTrackName').val();        
        request('GET', `/track/${trackName}`)  
        .then((results) => {        
            DATA.results = results;
            return results;
        })            
        .then((results) => {
            emit('search', results);
        });
    });
};

// Insert track into playlist
function addTrack(playlistId) {
    $('.js-searchTracks').on('click', '.js-addTrackBtn', function (event) {
        event.preventDefault();
        let trackId = $(event.currentTarget).parent()[0].id;
        let selectedTrack = DATA.results.find((item) => item.songId === trackId);        
        request('POST', `/playlist/${playlistId}/track`, selectedTrack)
        .then(() => {
            emit('add');
        });     
    });
};

// Delete track from playlist
function deleteTrack() {
    $('.js-playlist').on('submit', 'form', function (event) {
        event.preventDefault();                
        request('DELETE', event.target.action)
        .then(() => {
            emit('delete');
        });        
    });
}

// RENDER 

function displayTracks() {
    let results = DATA.playlist.content.map((item) => renderTrack(item)).reverse();
    $('.js-playlist').html(results);
};

function renderTrack(result) {
    return `
    <div class="track-item" id=${result.songId}>  
    <img class='track-img' src='${result.thumbnail}'>
    <h3>${result.songTitle}</h3>        
    <h6>Artist: ${result.songArtist}</h6>        
    <h6>Album: "${result.songAlbum}"</h6>                        
    <form class="delete" action="/playlist/${DATA.playlistId}/track/${result.songId}">
    <button class='js-deleteTrackBtn btn btn-success' type="submit"><span class='action-label'>Delete</span></button>
    </form>
    </div>
    `;
};

function displaySearchTracks() {
    let results = DATA.results.map((item) => renderSearchTracks(item));
    $('.js-searchTracks').html(results);
};

function renderSearchTracks(result) {
    return `     
    <div class='track-item' id=${result.songId}>         
    <img class='track-img' src='${result.thumbnail}'>
    <h3>${result.songTitle}</h3>        
    <h6>Artist: ${result.songArtist}</h6>                
    <button class='js-addTrackBtn btn btn-success'><span class='action-label'>Add Track</span></button>                     
    </div>
    `;
}

// ON PAGE LOAD & HANDLERS

function trackHandlers(playlistId) {
    searchTracks(playlistId);
    addTrack(playlistId);
    deleteTrack();
};

function onPageLoad() {    
    const playlistId = DATA.playlistId;
    getTracks(playlistId);
    trackHandlers(playlistId);
}

$(onPageLoad);