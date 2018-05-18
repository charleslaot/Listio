'use strict'

// const accessToken = "BQAff3wwlD76SbHm3pj-2c95GtgNUi5Lq8YfC8TQUCK2-UASFvjjo0xpToEMaF29gyoKuOSfyHK-VXphgBk"

const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
var accessToken;

function getToken(){    
    $.ajax({
        url:'http://localhost:8080/access_token',
        success: function(data){            
            accessToken = data;                         
        }
    });
};

function getTrack(searchTerm, callback) {
    const settings = {
      url: SPOTIFY_SEARCH_URL,
      headers:  {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',        
      },
      data: {
        q: `${searchTerm}`,
        type: 'track',
        limit: '7'              
      },      
      type: 'GET',
      success: callback
    };    
    $.ajax(settings);
  }

$('.js-form').submit(event => {
    event.preventDefault();    
    let query = $(event.currentTarget).find('.search-field').val();    
    getTrack(query, displayData);
    });

function displayData(data){    
    const results = data.tracks.items.map((item, index) => renderResult(item));
    $('.js-results').html(results);
}


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
  }


  $(getToken());