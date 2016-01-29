'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
    caption : String,
    url : String,
    owner: String
});




module.exports = mongoose.model('Bar', Bar);
