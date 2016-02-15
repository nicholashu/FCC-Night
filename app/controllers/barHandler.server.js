'use strict';


var Bars = require('../models/bars.js');

function BarHandler() {

  /*  this.getPinArray = function(req, res)
        Pins.find().sort({
                _id: -1
            })
            .exec(function(err, result) {
                if (err) throw err;
                res.send(result);
            });
    }; */
    this.getReservation = function(req, res) {
        Pins.find({
          owner: req.params.id
        })
            .exec(function(err, result) {
                if (err) throw err;
                res.send(result);
            });
    };

    this.setAttending = function(req, res){
          Bars.findOneAndUpdate({
            "id": req.params.location
          },
           {$addToSet: {"attending": req.params.user}},
           {"new": true, "upsert": true},
           function(err) {
                if (err) {
                    throw err;
                }
                res.send(req.body);
            });
        };


    //add is owner flag..
    this.removePin = function(req, res) {
        Pins.findOneAndRemove({
            "_id": req.params.id
        }, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

}

module.exports = BarHandler;
