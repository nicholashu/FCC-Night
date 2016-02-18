'use strict';

var path = process.cwd();
var BarHandler = require(path + '/app/controllers/barHandler.server.js');
var YelpHandler = require(path + '/app/controllers/yelpHandler.server.js')


module.exports = function(app, passport) {

  function isLoggedIn(req, res, next) {
    console.log("checking login");
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/auth/twitter');
    }
  }

  var barHandler = new BarHandler();
  var yelpHandler = new YelpHandler();

app.route('/')
  .get(function(req,res){
    res.sendfile(path + '/public/index.html');
  });


  app.route('/logout')
    .get(function(req, res) {
      req.logout();
      res.redirect('/');
    });



  app.route('/api/:id')
    .get(isLoggedIn, function(req, res) {
      res.json(req.user);
    });

  app.get('/auth/twitter',
    passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });


  app.route('/api/yelp/:location')
  .get(yelpHandler.barLocationSearch); //gets list of bars based on location

  app.route('/api/reserve/')
  .get(yelpHandler.checkReservations);

  app.route('/api/reserve/:barId/:userId')
  .post(isLoggedIn, yelpHandler.makeReservation);
};
