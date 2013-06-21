
/*
 * GET home page.
 */
 var nodeio = require('node.io');

 exports.index = function(req, res){
 	res.render('index', { title: 'Hazey' });
 };

//Get latest PSI report
exports.latest = function(req, res){
	nodeio.scrape(function() {
		this.getHtml('http://app2.nea.gov.sg/weather-climate/haze-updates/psi-readings', function(err, $) {
			var tempReadings = [];
			$('td').each(function(title) {
				tempReadings.push(title);
			});
        //console.log(JSON.stringify(readings));
         //this.emit(stories);
         var readings = [];

         for (var i = 14; i<= 25; i++){
         	readings.push(tempReadings[i].text);
         }

         for (var i = 40; i<= 51; i++){
         	readings.push(tempReadings[i].text);
         }

         // Get latest reading
         var latestReading;
         var obj = new Object();
         for (var i=0; i<readings.length; i++){
         	
         	if (i==readings.length-1){
         		//Last reading, push dump to mongo
         		var time = matchTime(i);

         		obj.time = time;
         		obj.reading = readings[i];
         	} else if (readings[i]=="-"){
         		var time = matchTime(i-1);

         		obj.time = time;
         		obj.reading = readings[i-1];

         		break;
         	}
         }

         res.send(JSON.stringify(obj));
     });
	});
};

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