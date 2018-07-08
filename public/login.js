'use strict';

$('.js-LoginForm').submit(event => {
    event.preventDefault();
    let email = $(event.currentTarget).find('#email').val();
    let pass = $(event.currentTarget).find('#password').val();
    userValidation(email, pass)
      .then(token => {                 
        sessionStorage.setItem('token', token.authToken); 
        location.href = "/playlists";
      });   
});

function userValidation(userEmail, userPass) {
  return new Promise((resolve, reject) => {
    const settings = {
      url: '/api/auth/login',
      data: JSON.stringify({
        username: userEmail,
        password: userPass
      }),
      dataType: 'json',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
    };
    let results = $.ajax(settings);    
    resolve(results);
  });
};