var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

var bufferArrayToDecimal = require('../lib/index.js').bufferArrayToDecimal;

var degreeFixer = function(bufferArray) {  // needed when using ollie's IMU values
	var array = bufferArray;
	var degree = bufferArrayToDecimal(array);
	if (degree > 10000) { // Ollie nedense 180 i geçince 65535 civari sayılar dönüyor :D onun için
		degree = 65535 - degree;
		degree = 180 + (180 - degree);
	}
	return degree;
}

var degreeFixerRoll = function(bufferArray) {
	var array = bufferArray;
	var degree = bufferArrayToDecimal(array);
	if (degree > 10000) {
		degree = 65535 - degree;
		degree = [degree, 'L'];
	} else {
		degree = [degree, 'R'];
	}
	return degree;
}

ollie.once("connect", function(){
	ollie.on('dataStream', function(data){
		var pitch = degreeFixer(data.slice(0,2));
		var roll = degreeFixerRoll(data.slice(2,4)); // roll is a little different, it just goes from 0 to 180 ; returns a object
		var yaw = degreeFixer(data.slice(4,6));
		
		console.log("yaw: ",yaw, " roll: ", roll, " pitch: ",pitch);
	});

	// --explanation below was taken from cylon-ollie repository--

	// The data sources available for data Streaming from the
	// sphero API are as follows:
	// ["motorsPWM", "imu", "accelerometer", "gyroscope", "motorsIMF"
	//  "quaternion", "locator", "accelOne", "velocity", "odometer"]
	// It is also possible to pass an opts object to setDataStreaming():
	var opts = {
		// n: int, divisor of the max sampling rate, 400 hz/s
		// n = 40 means 400/40 = 10 data samples per second,
		// n = 200 means 400/200 = 2 data samples per second
		n: 40,
		// m: int, number of data packets buffered before passing to the stream
		// m = 10 means each time you get data it will contain 10 data packets
		// m = 1 is usually best for real time data readings.
		m: 1,
		// pcnt: 1 -255, how many packets to send.
		// pcnt = 0 means unlimited data Streaming
		// pcnt = 10 means stop after 10 data packets
		pcnt: 0,
	}
	ollie.driver.setDataStreaming(['imu'], opts);
});

ollie.init()