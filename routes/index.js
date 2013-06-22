
/*
 * GET home page.
 */
var nodeio = require('node.io');
var db = require('../model/db');
var dateGlobal = null;
var doneGlobal = true;

var endpoint = "http://app2.nea.gov.sg/anti-pollution-radiation-protection/air-pollution/psi/past-24-hour-psi-readings";

 exports.index = function(req, res){
 	res.render('index', { title: 'Hazey' });
 };

//Get latest PSI report
exports.latest = function(req, res){
	nodeio.scrape(function() {
		this.getHtml(endpoint, function(err, $) {
			var tempReadings = [];
			$('td').each(function(title) {
				tempReadings.push(title);
			});
        //console.log(JSON.stringify(readings));
        //res.send(JSON.stringify(tempReadings));
         //this.emit(stories);
         var readings = [];

         for (var i = 32; i<= 43; i++){
         	readings.push(tempReadings[i].fulltext);
         }

         for (var i = 58; i<= 69; i++){
         	readings.push(tempReadings[i].fulltext);
         }

         // Get latest reading
         var latestReading;
         var obj = new Object();
         for (var i=0; i<readings.length; i++){
         	
         	if (i==readings.length-1){
         		//Last reading, push dump to mongo
         		var storage = [];
		        var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!

				var yyyy = today.getFullYear();
				if(dd<10){dd='0'+dd};
				if(mm<10){mm='0'+mm};
				today = dd+'/'+mm+'/'+yyyy;
				console.log(today);

		 		for (var j = 0; j<readings.length; j++){
		 			var store = new Object();
		 			store.time = matchTime(j);
		 			store.value = parseInt(readings[j]);
		 			store.date = today;
		 			storage.push(store);
		 		}

		 		if (doneGlobal == false){
		 		//data hasnt been stored for today
		 			storeInDB(storage);
		 			doneGlobal = true;
		 		}

		 		// this will ensure that we reset the storage flag
		 		if (dateGlobal != today){
		 			dateGlobal = today;
		 			doneGlobal = false;
		 		}

         		var time = matchTime(i);

         		obj.time = time;
         		obj.reading = readings[i];
         	} else if (readings[i]=="-"){
         		var temp = i - 1;
         		while (readings[temp] == "-"){
         			temp-=1;
         		}
         		var time = matchTime(temp);

         		obj.time = time;
         		obj.reading = readings[i-1];

         		break;
         	}
         }

         res.send(JSON.stringify(obj));
     });
	});
};

// Get last :limit values from DB. If limit is not given, return 10.
// JSON:
// {
// 	[
// 		{
// 			"time":"",
// 			"reading":""
// 		}
// 	]
// }
exports.list = function(req, res){
	var limit = null;
	if (typeof req.params.limit == 'undefined')
		limit = 10;
	else
		limit = req.params.limit;

	// db.getLogs(limit, function(err, result){
	// 	if (err){
	// 		console.log(err);
	// 	} else {
	// 		console.log(result);
	// 	}

	// 	var jsonarray = [];
	// 	for (var i=0; i<result.length; i++){
	// 		var obj = new Object();
	// 		obj.time = result[i].time;
	// 		obj.reading = result[i].value;
	// 		jsonarray.push(obj);
	// 	}

	// 	res.send(JSON.stringify(jsonarray));
	// });

	nodeio.scrape(function() {
		this.getHtml(endpoint, function(err, $) {
			var tempReadings = [];
			$('td').each(function(title) {
				tempReadings.push(title);
			});
        //console.log(JSON.stringify(tempReadings));
         //this.emit(stories);
         var readings = [];

         for (var i = 32; i<= 43; i++){
         	readings.push(tempReadings[i].fulltext);
         }

         for (var i = 58; i<= 69; i++){
         	readings.push(tempReadings[i].fulltext);
         }


         //Get last 10 readings
         var latestReadings = [];
         
         for (var i=readings.length -1 ; i>=0; i--){
         	console.log(readings[i]);
         	if (readings[i] == "-"){
         		continue;
         	} else {
         		var obj = new Object();
         		obj.reading = readings[i];
         		obj.time = matchTime(i);
         		latestReadings.push(obj);

         		if (latestReadings.length == limit){
         			break;
         		}		
         	}
         }

         res.send(JSON.stringify(latestReadings));
    	});
	});
};

function storeInDB(readings){
	 db.saveLogs(readings, function(err, result){
		if (err){
			console.log(err);
		} else {
			console.log(result);
		}
 	});
}

function matchTime(readingNumber){
	if (readingNumber == 0){
		return "12 AM";
	} else if (readingNumber > 0 && readingNumber <= 11){
		return readingNumber + " AM";
	} else if (readingNumber == 12) {
		return readingNumber + " PM";
	}
	else {
		return (parseInt(readingNumber) - 12) + " PM";
	}
}