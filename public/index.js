'use strict';

$('.js-RegForm').on('click', '.js-SignUpBtn', function (event) {
    event.preventDefault();
    location.href = "/signup"
});

$('.js-RegForm').on('click', '.js-LogInBtn', function (event) {
    event.preventDefault();
    location.href = "/login"
});

$(".index-container").hide().fadeIn(1500);