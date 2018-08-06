'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {  
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.id.toString(),    
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

/**
 * Fetch an AuthToken once user is registered
 * @name Fetch an AuthToken once user is registered
 * @route {POST} /api/auth/login
 * @bodyparam {Json} user 'email' and 'password' are required
 * @authentication This route requires Local authentication (Registered user and password).
 */
router.post('/api/auth/login/', localAuth, (req, res) => {        
  const authToken = createAuthToken(req.user.serialize());  
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

module.exports = {router};
