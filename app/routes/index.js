'use strict';

var path = process.cwd();
var BarHandler = require(path + '/app/controllers/barHandler.server.js');
var YelpHandler = require(path + '/app/controllers/yelpHandler.server.js')


module.exports = function(app, passport) {

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  var barHandler = new BarHandler();
  var yelpHandler = new YelpHandler();

app.route('/')
  .get(function(req,res){
    res.sendfile(path + '/public/index.html');
  });

  app.route('/login')
    .get(function(req, res) {
      res.sendFile(path + '/public/login.html');
    });


  app.route('/signup')
    .get(function(req, res) {
      res.sendFile(path + '/public/signup.html', {
        message: req.flash('signupMessage')
      });
    });

  app.route('/logout')
    .get(function(req, res) {
      req.logout();
      res.redirect('/login');
    });


  app.route('/api/:id')
    .get(isLoggedIn, function(req, res) {
      res.json(req.user);
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.get('/auth/twitter',
    passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });


  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.post('/login',
    passport.authenticate('local-login'),
    function(req, res) {
      res.redirect('/' + req.user);
    });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.route('/api/yelp/:location')
  .get(yelpHandler.barLocationSearch); //gets list of bars based on location

};
