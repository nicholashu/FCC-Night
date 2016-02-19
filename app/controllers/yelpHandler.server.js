'use strict';


var Bars = require('../models/bars.js');
var Users = require('../models/users.js');


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
    console.log("searching for bars");
    var barList = [];
    var barIds = [];
    var yelpBars = [];
    var output = [];
    yelp.search({
        term: "bar",
        location: req.params.location,
        sort: 1,
        limit: 5
      })
      .then(function(data) {

        var yelpBars = data.businesses;

        yelpBars.forEach(function(bar) {
          barList.push({
            _id: bar.id,
            name: bar.name,
            going: 0
          });
          barIds.push(bar.id);
        });

        Bars.create(barList);

        Bars.find().where('_id').in(barIds).exec(function(err, bars) {

          if (err) {
            console.log(err);
          }
          bars.forEach(function(bar, index) {
            yelpBars.every(function(v) {
              if (bar.id === v.id) {
                v.going = bar.going;
                bars[index]['total'] = v.total;
                return false;
              }
              else {
                return true;
              }
            });
          });

          return res.status(200).json(yelpBars);
        });
      });
  };

  this.checkReservations = function (req, res){
    var barIds = [];
    yelp.search({
        term: "bar",
        location: req.params.location,
        sort: 1,
        limit: 5
      })
    .then(function(data) {
        var yelpBars = data.businesses;
        yelpBars.forEach(function(bar) {
          barIds.push(bar.id);
        });
    Bars.find().where('_id').in(barIds).exec(function(err, yelpBars){
  console.log(err);
  console.log(yelpBars);
        return res.status(200).json(yelpBars);
    });
  });
  };

  this.makeReservation = function(req, res) {
    console.log("Inserting RSVP");
    var user = req.params.userId;
    var bar = req.params.barId;
    console.log(user);
    Users.update({
        '_id': user
      }, {
        $addToSet: {
          'shared.bars': bar
        }
      },
      function(err, docs) {
        console.log("updated user info with bar")
        if (docs) {
          Bars.update({
              '_id': bar
            }, {
              $inc: {
                going: 1
              }
            },
            function(err, results) {
              console.log("updated bar!");
              if (err) {
                console.log(err);
                throw err;
              }
              res.json(results);
            }
          );
        }
      }
    );
  };



  this.deleteReservation = function(req, res) {
    console.log("removing RSVP");
    var user = req.params.userId;
    var bar = req.params.barId;
    Users.update({
        '_id': user
      }, {
        $pull: {
          'shared.bars': bar
        }
      },
      function(err, docs) {
        console.log("updated user info with bar")
        if (docs) {
          Bars.update({
              '_id': bar
            }, {
              $inc: {
                going: -1
              }
            },
            function(err, results) {
              console.log("updated bar!");
              if (err) {
                console.log(err);
                throw err;
              }
              res.json(results);
            }
          );
        }
      }
    );
  };

};


module.exports = YelpHandler;


/*  Bars.find().sort({
  _id: -1
})
.exec(function(err, result) {
  if (err) throw err;
  res.send(result);
}
);



Bars.find({id: bar.id},function (err, dbBar) {
console.log(dbBar);
console.log(dbBar === false);
if(!dbBar) {
console.log("saving new bar");
var newBar = new Bars({
id: bar.id,
going: ""
});
newBar.save();
}
}); */
