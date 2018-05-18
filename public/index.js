'use strict'

const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const accessToken = "BQBhxd_9Te90cEGxFt4j4V3aJ6cA0FLYH42_zwKeibUy3UkvvP5WckAoD1fvUgW_vydXJp2DsCTmsGLSee0"

function getDataFromApi(searchTerm, callback) {
    const settings = {
      url: SPOTIFY_SEARCH_URL,
      headers:  {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        q: `${searchTerm}`,
        type: 'track'
      },
      dataType: 'json',      
      type: 'GET',
      success: callback
    };
  
    $.ajax(settings);
  }