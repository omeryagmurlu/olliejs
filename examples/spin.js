var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

ollie.once("connect", function(){
	ollie.driver.setRGB(0xFF0000);
	ollie.driver.setRawMotorValues(
        ollie.driver.MotorForward, 200,
        ollie.driver.MotorReverse, 200
    );
	setInterval(function(){
		ollie.driver.setRawMotorValues(
        	ollie.driver.MotorReverse, 200,
        	ollie.driver.MotorForward, 200
        );

		setInterval(function(){
			ollie.driver.stop(function(){
				ollie.driver.sleep(0);
			});
		},2000);
	},2000);
});

ollie.init()