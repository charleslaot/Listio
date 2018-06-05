'use strict'

const DATA = {
    results: [],
    playlist: [],
    playlistId: location.pathname.split('/')[2]
};

function emit(event, payload) {
    console.log(event, payload);
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
            console.log('fetch');
            DATA.playlist = payload;
            displayTracks();

    }
    //render();
}

// Tracks handlers
function trackHandlers(playlistId) {
    submitSearch(playlistId);
    addTrack(playlistId);
    deleteTrack(playlistId);
};

function submitSearch(playlistId) {
    $('.js-tracksForm').submit(event => {
        event.preventDefault();
        let trackName = $(event.currentTarget).find('.js-newTrackName').val();
        searchTracks(trackName)
            .then((data) => {
                emit('search', data);
            });
    });
}

// Get track list
function getTracks(playlistId) {
    return new Promise((resolve, reject) => {
        let listTracksURL = `/playlist/${playlistId}/tracks`;
        const settings = {
            url: listTracksURL,
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        };
        let results = $.ajax(settings);
        resolve(results)
    }).then((playlist) => {
        emit('fetch', playlist);
    });
};

// Search for tracks
function searchTracks(track) {
    return Promise.resolve().then(() => {
        let searchTracksURL = `/track/${track}`;
        const settings = {
            url: searchTracksURL,
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        };
        return $.ajax(settings);
    }).then(results => {
        DATA.results = results;
        return results;
    });
};

// Insert track into playlist
function addTrack(playlistId) {
    $('.js-searchTracks').on('click', '.js-addTrackBtn', function (event) {
        event.preventDefault();
        let trackId = $(event.currentTarget).parent()[0].id;
        let selectedTrack = DATA.results.find((item) => item.songId === trackId);
        let addTracksURL = `/playlist/${playlistId}/track`;
        const settings = {
            url: addTracksURL,
            dataType: 'json',
            data: JSON.stringify(selectedTrack),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        };
        $.ajax(settings);
    });
};

function deleteTrack(playlistId) {
    $('.js-playlist').on('submit', 'form.delete', function (event) {
        event.preventDefault();
        let trackId = $(event.currentTarget).parent()[0].id;
        let addTracksURL = event.target.action;
        const settings = {
            url: addTracksURL,
            dataType: 'json',
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
        };
        $.ajax(settings).then(() => emit('delete'));
    });
}

// Render functions
function displayTracks() {
    let results = DATA.playlist.content.map((item) => renderTrack(item)).reverse();
    $('.js-playlist').html(results);
};

function renderTrack(result) {
    return `
    <br>
    <br>
    <div id=${result.songId}>  
    <img src='${result.thumbnail}'>
        <form class="delete" action="/playlist/${DATA.playlistId}/track/${result.songId}">
            <button class='js-deleteTrackBtn' type="submit">Delete Track</button>
        </form>
        <p>Song: ${result.songTitle}</p>        
        <p>Artist: ${result.songArtist}</p>        
        <p>Album: ${result.songAlbum}</p>                        
    </div>
    `;
};

function displaySearchTracks() {
    let results = DATA.results.map((item) => renderSearchTracks(item));
    $('.js-searchTracks').html(results);
};

function renderSearchTracks(result) {
    return `     
        <div id=${result.songId}>         
            <img src='${result.thumbnail}'>
            <button class='js-addTrackBtn'>Add Track</button>                     
            <p>Song: ${result.songTitle}</p>        
            <p>Artist: ${result.songArtist}</p>                
        </div>
    `;
}


// When page loads handler
function onPageLoad() {    
    // load data
    const playlistId = DATA.playlistId;
    getTracks(playlistId);

    // setup click handlers
    trackHandlers(playlistId);
}

$(onPageLoad());
