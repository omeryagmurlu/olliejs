var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

ollie.once("connect", function(){
	var heading = 0;

	ollie.on('collision', function(data) {
		console.log("Collision, Speed: " + data.Speed + "/255, Time in seconds since connection: " + data.Timestamp/1000 +"s.");
		heading = Math.abs(heading-180);
		ollie.driver.roll(40,heading,1);
	});

	// default = speed threshold = 80 ; wait time = 800 ms;
	ollie.driver.detectCollisions();

	// speed threshold = 1 ; wait time = 10 ms; (useful for getting data easy way)
	//ollie.driver.detectCollisions(1,1);

	// speed threshold = 30 ; wait time = 10 ms;
	//ollie.driver.detectCollisions(30,1);

	// speed threshold = 30 ; wait time = 100 ms;
	//ollie.driver.detectCollisions(30,10);

	// speed threshold = 255 ; wait time = 1000 ms;
	//ollie.driver.detectCollisions(255,100);

	ollie.driver.roll(40,heading,1);
});

ollie.init()