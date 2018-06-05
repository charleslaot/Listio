'use strict'

// Dev Channel
const BASE_URI = 'http://localhost:8080';


// Tracks handlers
function trackHandlers() {
    $('.js-tracksForm').submit(event => {
        event.preventDefault();
        let trackName = $(event.currentTarget).find('.js-newTrackName').val();
        searchTracks(trackName)
            .then(displaySearchTracks)
            .then(addTrack)
    });

};

// Get track list
function getTracks() {
    return new Promise((resolve, reject) => {
        let listTracksURL = window.location.href + '/tracks';
        const settings = {
            url: listTracksURL,
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        };
        let results = $.ajax(settings);
        resolve(results)
    });
};

// Search for tracks
function searchTracks(track) {
    return new Promise((resolve, reject) => {
        let searchTracksURL = `${BASE_URI}/track/${track}`;
        const settings = {
            url: searchTracksURL,
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        };
        let results = $.ajax(settings);
        resolve(results)
    });
};

// Insert track into playlist
function addTrack(trackList) {
    return new Promise((resolve, reject) => {
        $('.js-searchTracks').on('click', '.js-addTrackBtn', function (event) {
            event.preventDefault();
            let trackId = $(event.currentTarget).parent()[0].id;
            let selectedTrack = trackList.find((item) => item.songId === trackId);
            let addTracksURL = '/track';
            const settings = {
                url: addTracksURL,
                dataType: 'json',
                data: JSON.stringify(selectedTrack),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
            };
            let results = $.ajax(settings);
            resolve(results);
        });
    })
};

function deleteTrack() {
    return new Promise((resolve, reject) => {
        $('.js-searchTracks').on('click', '.js-deleteTrackBtn', function (event) {
            event.preventDefault();
            console.log('delete');
            let trackId = $(event.currentTarget).parent()[0].id;
            let addTracksURL = `/track/${selectedTrack.trackId}`;
            const settings = {
                url: addTracksURL,
                dataType: 'json',
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8',
            };
            let results = $.ajax(settings);            
            getTracks()
                then(displayTracks)
        });
    })
}

// Render functions
function displayTracks(data) {
    return new Promise((resolve, reject) => {
        let results = data.content.map((item) => renderTrack(item)).reverse();
        $('.js-playlist').html(results);
        resolve(data);
    });
};

function renderTrack(result) {
    return `
    <br>      
    <br>
    <div id=${result.songId}>  
    <img src='${result.thumbnail}'>
            <button class='js-deleteTrackBtn'>Delete Track</button>
            <p>Song: ${result.songTitle}</p>        
            <p>Artist: ${result.songArtist}</p>        
            <p>Album: ${result.songAlbum}</p>                        
        </div>
    `;
};

function displaySearchTracks(data) {
    return new Promise((resolve, reject) => {
        let results = data.map((item) => renderSearchTracks(item));
        $('.js-searchTracks').html(results);
        resolve(data);
    });
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
    getTracks()
        .then(displayTracks)        
}

$(onPageLoad());