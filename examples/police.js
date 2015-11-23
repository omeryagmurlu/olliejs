var police = function(s, delay1, delay2) {
	s.setRGB(0x000000, false);
	s.setBackLED(0);
	setTimeout(function() {
		s.setRGB(0x0000FF);
		s.setBackLED(255);
	}, delay1);
	setTimeout(function() {
		s.setRGB(0x000000, false);
		s.setBackLED(0);
	}, delay1*2);
	setTimeout(function() {
		s.setRGB(0x0000FF, false);
		s.setBackLED(255);
	}, delay1*3);
	setTimeout(function() {
		s.setRGB(0x000000, false);
		s.setBackLED(0);
	}, delay1*4);

	setTimeout(function() {
		s.setRGB(0xFF0000, false);
	}, delay1*5);
	setTimeout(function() {
		s.setRGB(0x000000, false);
	}, delay1*6);
	setTimeout(function() {
		s.setRGB(0xFF0000, false);
	}, delay1*7);
	setTimeout(function() {
		s.setRGB(0x000000, false);
	}, delay1*8);

	setTimeout(function() {
		police(s, delay1, delay2);
	}, delay2+delay1*8);
};

var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

ollie.on("connect", function(){
	police(ollie.driver, 25, 50);
});

ollie.init()