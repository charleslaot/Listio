'use strict'

const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const cons = require('consolidate');

const app = express();

app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {            
            resolve(server);
        }).on('error', err => {
            reject(err)
        });
    });
}


function closeServer() {
    return new Promise((resolve, reject) => {        
        server.close(err => {
            if (err) {
                reject(err);                
                return;
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};


module.exports = {runServer, app, closeServer};