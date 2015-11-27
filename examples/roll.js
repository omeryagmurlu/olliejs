var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

ollie.once("connect", function(){
	setTimeout(function(){
		ollie.setRGB('0x00FFFF');
	},200);

	setTimeout(function(){
		ollie.setRGB(0xFF0000);
		ollie.roll(60,0,1);

		setTimeout(function(){
			ollie.setRGB(0xFF0000);
			ollie.roll(60,90,1);

			setTimeout(function(){
				ollie.stop(function(){
					ollie.halt();
				});
			},1000);
		},1000);
	},500);
});

ollie.init()