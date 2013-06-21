var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var user = new mongoose.Schema({
  id: {type: String, unique: true},
  qrcode: String,
  name: String,
  email:String,
  rfid:String,
  entered:Boolean,
  facebookid:Number,
  facebooktoken:String,
  eventid:String
});

var events = new mongoose.Schema({
  id:{type: String, unique: true},
  event_name:String,
});

var entries = new mongoose.Schema({
  id:{type: String, unique: true},
  rfid:String,
  location:String,
  timestamp:{type : Date, default: Date.now },
  eventid:String,
});

var votes = new mongoose.Schema({
  id:{type: String, unique: true},
  rfid:String,
  screen_num:Number,
  item_num:Number,
  eventid:String
});

exports.user = user;
exports.events = events;
exports.entries = entries;
exports.votes = votes;