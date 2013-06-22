
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , db = require('./model/db')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , nodeio = require('node.io')
  , request = require('request')
  , mime = require('mime')
  , fs = require('fs');

var schedule = require('node-schedule');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret:'hazesg'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/latest', routes.latest);
app.get('/list/:limit', routes.list);
app.get('/list', routes.list);
app.get('/download-android', function(req, res){
   var file = __dirname + '/public/files/Haze.apk';

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var rule = new schedule.RecurrenceRule();
rule.minute = [0, 2, 4, 6, 8, 10, 30, 45];

var cron = schedule.scheduleJob(rule, function(){
	request('http://nameless-scrubland-5187.herokuapp.com/latest', function(error, response, body) {
	    var latest = JSON.parse(body);
	    console.log("body: " + body);
	});
});