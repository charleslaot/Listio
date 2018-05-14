# REQUIREMENTS

- Create a client: Most of your time will be spent on the API layer of this app, but you'll need to create a client prototype that allows non-technical users to do something interesting or valuable with the API. You should refer to the criteria for capstones outlined here.

- Serve static files: The server, in addition to offering a REST API, will need to serve your client and any other static assets (for instance, images).

- Implement a REST API with all four CRUD operations: Your app idea will determine the content of what your API offers, but at a minimum, your app should support all four CRUD operations (create, read, update, delete).

- Comprehensive Tests for the API Layer: Each API endpoint should have test coverage. At a minimum that means having tests for the normal case — that means that if you had, say an account creation endpoint, you'd have a test that proves that when the endpoint gets a POST request with the correct data, a new account is created, and the expected response is returned.

- Use Continuous Integration: We'll ask you to set up continuous integration early on in your development process. This will give you an opportunity to practice on the job skills, and ensure that you don't ship broken code.


# USER STORIES
    User should be able to:
        + Login or Register(Sign Up) with email/username/Google/Facebook
        + Reset/recover their password
        + Search & Filter the music API for songs.
        + Create/Read/Update/Delete playlists. (CRUD)    
        + Play songs/playlist from the database/API and from other users
        + Put price to their playlist and sell it 
        + Buy playlist
        + Filter/Search/Sort playlists by title/time/genre/creator/songsNumber/lastModified/...        
        + Rate playlist and sellers and/or leave comments
        + Upload your songs(mp3, flac, wav) or playlist(m3u, cue, csv)
        + Share playlist between users and in Facebook, Twitter, Google+ 


# MVP
    + Login or Sign Up with username
    + Search & Filter the music API for songs.
    + Create/Read/Update/Delete playlists. (CRUD)    
    + Filter/Search playlists by title/time/genre/creator/songsNumber/lastModified/...


# USER SCREENS
    + Login Screen
    + Sign Up Screen
    + Screen for seeing, filter/search or delete the user's playlists (Home Playlist Screen)
    + Screen for create and/or edit the user's playlist (Create/Edit Screen)
    + Screen for confirming the deletion of playlist (Confirmation Screen)


# USER FLOW

    + Login Screen
        - User enter valid username and password --> Home Playlist Screen
        - User enter invalid username or password --> Error Message

    + Sign Up Screen
        - User enter valid username and password --> Success Message & redirects to Login Screen
        - User enter invalid username or password --> Error Message
        - User enter already taken username --> Warning Message & redirects to Login Screen
        
    + Home Playlist Screen 
        - User click on create playlist button --> Create/Edit Screen
        - User click on edit playlist button -->  Create/Edit Screen
        - User click on playlist name -->  Create/Edit Screen
        - User click on delete playlist button --> Confirmation Screen --> Delete Playlist        
        - User filter and/or search on filter menu and/or search bar --> Show matching playlists

    + Create/Edit Screen
        - User search on search bar --> Show matching songs from API
        - User click on matching song from search --> Add to playlists
        - User click on delete song button --> Delete song
        - User click on back arrow button --> Home Playlist Screen
