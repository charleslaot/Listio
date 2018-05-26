'use strict'

$('.js-form').submit(event => {
  event.preventDefault();
  let query = $(event.currentTarget).find('.search-field').val();
  getTrackFromSpotify(query, displayData);
});

function getTrackFromSpotify(searchTerm, callback) {
  const settings = {
    url: 'localhost:8080/track/clocks',
    data: {      
      type: 'track'
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
};

function displayData(data) {
  const results = data.tracks.items.map((item, index) => renderResult(item));
  $('.js-results').html(results);
};

function renderResult(result) {
  return `
      <br>      
      <div>                 
        <img src='${result.album.images[2].url}'>
        <p>Song: ${result.name}</p>        
        <p>Artist: ${result.album.artists[0].name}</p>        
        <p>Album: ${result.album.name}</p>        
        <br>
        <br>
      </div>
    `;
};