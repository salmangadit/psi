var http = require ('http');  
var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;
var schema = require('./schema');


var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/gogorilla';

var theport = process.env.PORT || 5000;

var User = mongoose.model( 'Users', schema.user );
var Event = mongoose.model( 'Events', schema.events );
var Entry = mongoose.model( 'Entries', schema.entries );
var Vote = mongoose.model( 'Votes', schema.votes );

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

// Create new user for the system
// Return: 
// NULL
var createUser = function(user,callback){
    User.create(user, function(err, res){
      if (err) {
        console.log(err);
        return callback(err, {});
      }
      console.log(res);
      return callback(null,res);
    });  
};

// Check if user exists or create a new one
// Return: 
// NULL
exports.findOrCreateUser = function(user, callback){
	console.log(user);
	console.log(callback);
    User.findOne({id: user.id}, null, function(err, result){
    	console.log('findOne result: ' + result);
      if (err) {
        console.log(err);
        return callback(err, {});
      } else if (!result) {
        // If user does not exist, createuser.
        return createUser(user, callback);
      } else {
        // If user exists, return user object.
        return User.update({id: user.id}, user, function(err, result){
          if (err) {
            console.log(err);
            return callback(err, {});
          }
          console.log(result);
          return callback(null, result);
        });
      }
  });
  };

  // Returns a full list of users in the system from all events
  // Return: 
  // Json:
  // [{
  //     _id:*,
  //     qrcode: *,
  //     name: *,
  //     email: *,
  //     rfid: *,
  //     entered: *,
  //     facebookid: *,
  //     facebooktoken: *,
  //     eventid: *
  // }]
  exports.getUsers = function(callback){
  console.log(callback);
    User.find(function(err, result){
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

  exports.getEventDetails = function(event_id, callback){
    Event.findOne({_id:event_id}, function(err, result){
      console.log('find result: ' + result);
      if (err) {
        console.log(err);
        return callback(err, {});
      } else {
        console.log(result);
        return callback(err, result);
      }
    });
  }

  // Returns a list of users at a particular event
  // Return: 
  // Json:
  // [{
  //     _id:*,
  //     qrcode: *,
  //     name: *,
  //     email: *,
  //     rfid: *,
  //     entered: *,
  //     facebookid: *,
  //     facebooktoken: *,
  //     eventid: *
  // }]
  exports.getUsersAtEvent = function(event_id, callback){
  console.log(callback);
    User.find({eventid:event_id}, function(err, result){
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

  // Returns the user that matches a particular RFID tag
  // Return: 
  // Json:
  // {
  //     _id:*,
  //     qrcode: *,
  //     name: *,
  //     email: *,
  //     rfid: *,
  //     entered: *,
  //     facebookid: *,
  //     facebooktoken: *,
  //     eventid: *
  // }
  exports.getUsersByRFID = function(rf_id, callback){
  console.log(callback);
    User.findOne({rfid:rf_id}, null, function(err, result){
      console.log('find result: ' + result);
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log(result);
        return callback(err, result);
      }
    });
  };

  // Returns the voting stats for a particular event
  // Return: 
  // Json:
  // {
  //   eventid,
  //   item11,
  //   item12,
  //   item13,
  //   item21,
  //   item22,
  //   item23,
  //   item31,
  //   item32,
  //   item33
  // }
  exports.getVoteStats = function(event_id, callback){
    var indexCheck = 0;
    var items = new Array();
    var screensCount = 3;
    var itemsCount = 3;
    var totalCount = screensCount * itemsCount;
    var innerCounter = 0;
    var result = new Object();
    result.eventid = event_id;

    for(var i=1; i<=screensCount; i++){
      console.log(i);
      items[i-1] = new Array();
      for (var j=1; j<=itemsCount; j++){
        console.log(i+","+j);
        (function(i,j){
          Vote.count({screen_num: i, item_num: j}, function(err, count){
            if (err) {
              console.log(err);
            } else {
              console.log("Count item"+i+j+": " + count);
              items[i-1][j-1] = count;
            }
            innerCounter++;
            if (innerCounter >= totalCount){
              for (var m = 1; m<=screensCount; m++){
                for (var n = 1; n<=itemsCount; n++){
                  result["item"+m+n] = items[m-1][n-1];
                }
              }

              console.log(result);
              return callback(err, result);
            }
          });
        })(i,j);
      }
    }
  }

  // Returns the entry stats for a particular event at a particular location
  // Return: 
  // Json:
  // [{
  //   entryid,
  //   rfid,
  //   location,
  //   timestamp,
  //   eventid,
  //   name,
  //   entered
  // }]
  exports.getEventEntriesAtLocation = function(event_id, location_id, callback){
  console.log(callback);
  var mergedResult = new Array();
    Entry.find({eventid:event_id, location:location_id}, function(err, result){
      if (err) {
        console.log(err);
        return callback(err, {});
      } else {
        var index = null;
        for (var i=0; i< result.length; i++){
            (function(i) {
                index = i;
                User.findOne({rfid:result[i].rfid}, null, function(err, userresult){
                  var currResult = result[i];
                  console.log(i);
                  if (err) {
                    console.log(err);
                    return callback(err, {});
                  } else {
                    var finalResult = new Object();
                    finalResult.name = userresult.name;
                    finalResult.entered = userresult.entered;
                    finalResult._id = currResult._id;
                    finalResult.rfid = currResult.rfid;
                    finalResult.location = currResult.location;
                    finalResult.timestamp = currResult.timestamp;
                    finalResult.eventid = currResult.eventid;

                    index--;
                    mergedResult.push(finalResult);

                    if (index<0){
                      return callback(err, mergedResult);
                    }
                  }
                });
            })(i);
        }
      }
    });
  };

