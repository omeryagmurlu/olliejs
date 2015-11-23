var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

ollie.once("connect", function(){
	setTimeout(function(){
		ollie.driver.setRGB('0x00FFFF');
	},200);

	setTimeout(function(){
		ollie.driver.setRGB(0xFF0000);
		ollie.driver.roll(60,0,1);

		setTimeout(function(){
			ollie.driver.setRGB(0xFF0000);
			ollie.driver.roll(60,90,1);

			setTimeout(function(){
				ollie.driver.stop(function(){
					ollie.driver.sleep(0);
				});
			},1000);
		},1000);
	},500);
});

ollie.init()