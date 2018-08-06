'use strict';

$('.js-RegForm').on('click', '.js-SignUpBtn', function (event) {
    event.preventDefault();
    location.href = "/signup"
});

$('.js-RegForm').on('click', '.js-LogInBtn', function (event) {
    event.preventDefault();
    location.href = "/login"
});

$('.js-DemoForm').on('click', '.js-DemoBtn', function (event) {
    event.preventDefault();
    demoUser()
        .then(token => {
        sessionStorage.setItem('token', token.authToken);
        location.href = "/playlists";
    });
});

function demoUser() {
    return new Promise((resolve, reject) => {
      const settings = {
        url: '/api/auth/login',
        data: JSON.stringify({
          username: 'demo@listio.com',
          password: 'demo123'
        }),
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
      };
      let results = $.ajax(settings);
      resolve(results);
    });
  };

$(".index-container").hide().fadeIn(1500);