var http = require ('http');  
var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;
var schema = require('./schema');


var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/haze';

var theport = process.env.PORT || 5000;

var Log = mongoose.model( 'Log', schema.logs );

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

// Create new PSI entry log for the system
// Return: 
// NULL
var createLog = function(log,callback){
    Log.create(log, function(err, res){
      if (err) {
        console.log(err);
        return callback(err, {});
      }
      console.log(res);
      return callback(null,res);
    });  
};


exports.saveLogs = function(logs, callback){
    console.log("Storing");
    return createLog(logs, callback);
}


  // Returns a full list of PSI logs in the system
  exports.getLogs = function(callback){
  console.log(callback);
    Log.find(function(err, result){
      console.log('find result: ' + result);
      if (err) {
        console.log(err);
        return callback(err, {});
      } else {
        console.log(result);
        return callback(err, result);
      }
    });
  };

  
