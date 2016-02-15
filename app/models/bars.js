'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
  _id: String,
  name: String,
  going: Number
});




module.exports = mongoose.model('Bar', Bar);
