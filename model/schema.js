var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var logs = new mongoose.Schema({
  id: {type: Number},
  value: Number,
  time: String,
  date: String,
});

exports.logs = logs;