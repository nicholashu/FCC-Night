'use strict';


var bar = require('../models/bars.js');


var Yelp = require("yelp");

var yelp = new Yelp({
  consumer_key: "tQ-KNmyUsBQufogw7fFnRw",
  consumer_secret: "OeYU_MpaFIPjkUyTXPejalkz98I",
  token: "W3biqNhFqKFAStUdNgWh6v0Jsgli4BGB",
  token_secret: "TyCI01sBBtbyDHW6hndlNxR-UKc"
});


function YelpHandler() {
  // Get list of places for a location
  this.barLocationSearch = function(req, res) {
    yelp.search({term: "bar", location: req.params.location}, function(error, data) {
      if(error) { return handleError(data, error); }
      return res.status(200).json(data);
  });
  };

  // Get list of bars
  this.index = function(req, res) {
    Bar.find(function (err, bars) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(bars);
    });
  };

  // Get a single bar
  this.show = function(req, res) {
    Bar.findById(req.params.id, function (err, bar) {
      if(err) { return handleError(res, err); }
      if(!bar) { return res.status(404).send('Not Found'); }
      return res.json(bar);
    });
  };

  // Creates a new bar in the DB.
  this.create = function(req, res) {
    Bar.create(req.body, function(err, bar) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(bar);
    });
  };

  // Updates an existing bar in the DB.
  this.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Bar.findById(req.params.id, function (err, bar) {
      if (err) { return handleError(res, err); }
      if(!bar) { return res.status(404).send('Not Found'); }
      var updated = _.merge(bar, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(bar);
      });
    });
  };

  // Deletes a bar from the DB.
  this.destroy = function(req, res) {
    Bar.findById(req.params.id, function (err, bar) {
      if(err) { return handleError(res, err); }
      if(!bar) { return res.status(404).send('Not Found'); }
      bar.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.status(204).send('No Content');
      });
    });
  };


  function handleError(res, err) {
    return res.status(500).send(err);
  }

};



module.exports = YelpHandler;
