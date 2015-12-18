var ollie = new (require('../lib/index.js'))("ef66143e996d") //enter your ollie's UUID.

ollie.once("connect", function(){
	setInterval(function(){
		ollie.setRandomColor();
	},8);
});

ollie.init()
