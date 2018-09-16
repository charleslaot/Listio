Concept

Concept is clearly described on the landing page. Currently the application re-implements a subset of Spotify's functionality. I'd like to see you consider how you could add value on top of Spotify's API.

Functionality

I use a traffic light system for functionality review. G stands for green, meaning the feature is working well. Y stands for yellow, meaning the feature is mostly working but needs some attention. R stands for red, meaning the feature appears to be broken.

[Y] Sign Up
Form validations are incomplete. Submitting a blank password results in no hint for the user. (3)
Recommend automatically signing in the user after they register.

[Y] Sign In
Signing in with invalid credentials does not display any message to the user.
User stays signed in on page refresh. Nice work!

[?] Sign Out
Recommend adding a sign out feature.

[G] Add Playlist

[G] Delete Playlist
Recommend adding confirmation dialogue for any deletion functionality to prevent accidental deletion of data.

[G] Search Songs

[G] Add Song to Playlist

[G] Remove Song from Playlist
Recommend adding confirmation dialogue for any deletion functionality to prevent accidental deletion of data.

[G] Edit Playlist
Recommend populating name field with the current name, rather than starting from scratch which is disorienting. (2)
Recommend adding a way to cancel an edit.

Mobile-First Design
Mobile-First Design: Landing Page
Layout overflows horizontally on narrow screens. (1)

Mobile-First Design: Application
Recommend reducing the amount of spacing between playlist listings. (4)

Design/UX
Design/UX: Landing Page
It's not clear to me why I would choose to sign up or log in, rather than just click the "Let's Get Started" button. Recommend adding some indication of why I would want to sign up for an account.
Design/UX: Application

Currently, the playlist listings look fairly basic. Recommend reviewing some existing sites with listing pages and implementing patterns you like. See http://ux-archive.com, http://mobile-patterns.com, and http://dribbble.com for design inspiration.

Edit link on playlist listings makes the playlist names look uneven. Recommend placing the edit link somewhere where it will not interfere with the title text. (5)
It's conventional for clicking the title link in the header to return the user to the main application page when the user is signed in, rather than to the landing page which can result in an unintentional sign-out.