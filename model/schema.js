var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var logs = new mongoose.Schema({
  id: {type: Number, unique: true},
  value: Number,
  timestamp: {type : Date, default: Date.now },
});

exports.logs = logs;