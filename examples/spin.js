var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

ollie.once("connect", function(){
	ollie.setRGB(0xFF0000);
	ollie.setRawMotorValues(
		'Forward', 200,
		'Reverse', 200
	);
	setTimeout(function(){
		ollie.setRawMotorValues(
			'Reverse', 200,
			'Forward', 200
		);

		setTimeout(function(){
			ollie.stop(function(){
				ollie.halt();
			});
		},2000);
	},2000);
});

ollie.init()