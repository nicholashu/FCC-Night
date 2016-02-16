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
      yelp.search({
          term: "bar",
          location: req.params.location,
          sort: 1,
          limit: 5
        })
        .then(function(data) {
          console.log("found bars");
            var yelpBars = data.businesses;
            yelpBars.forEach(function(bar) {
              console.log("pushing bar to barList");
              barList.push({
                _id: bar.id,
                name: bar.name,
                going: 0
              });
              barIds.push(bar.id);
            });
            console.log("inserting into Db");
            Bars.create(barList);
            console.log("added to Db! /////// Finding Bars");
            Bars.find().where('_id').in(barIds).exec(function(err, yelpBars) {
              console.log("Found!")
              if (err) {
                console.log(err);
              }
              yelpBars.forEach(function(bar, index) {
                console.log("running through found Bars")
                yelpBars.every(function(v) {
                  if (bar.id === v._id) {
                    if (yelpBars[index].snippet_image_url) {
                      yelpBars[index].snippet_image_url = bar.snippet_image_url.replace("http://", "https://");
                    }
                    yelpBars[index]['total'] = v.total;
                    return false;
                  } else {
                    return true;
                  }
                });
                });
              });
              return res.status(200).json(yelpBars);
            });
          };

        this.makeReservation = function (req, res) {
            console.log("Inserting RSVP");
            var user = req.params.userId;
            var bar = req.params.barId;
            console.log(user);
            Users.findOneAndUpdate(
              {'_id' : req.body.userId},
					    { $addToSet : { 'shared.bars' : req.body.barId }},
              function (err,docs){
                console.log(err);
                console.log(docs);
                console.log("updated user info with bar")
                if (docs){
                  Bars.findOneAndUpdate(
                    {_id: req.body.barId},
                    [['total' , 'asc']],
									  { $inc: { total: 1 } },
									  {new : true},
                    function (err, results){
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
