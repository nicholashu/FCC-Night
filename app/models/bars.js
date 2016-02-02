'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
  url: {type:String, required: true},
  name: {type:String, required: true},
  rating_img_url: {type:String, required: true}
});




module.exports = mongoose.model('Bar', Bar);
