// Events loader, /- not a module, just convienent

var responseParser = require('./response-parser').spheroResponseParser();

var OllieRobotControlService = "22bb746f2ba075542d6f726568705327",
	Notify = "22bb746f2ba675542d6f726568705327";

var bufferToArray = require('./toolbelt').bufferToArray;

exports.load = function(_ollie) {
	_ollie.connection.on('connect', function(){
		_ollie.driver.devModeOn(function(){
			_ollie.driver.setBackLED('0', function(){ //To add the service we will need for getting NOTİFY Characteristic, we use it once with a service char 
				_ollie.emit("connect");
			});
		})
	})

	_ollie.on('connect', function(){
		_ollie.connection.noble._characteristics[_ollie.uuid][OllieRobotControlService][Notify].on("read", function(data, isNotify) {
			// Ollie has got a data for us
			responseParser(_ollie, data); // Achtung global !!!
		});
	})

	_ollie.on('data', function(packet) { //responseParser emits this
		switch (packet.SOP2) {
			case 0xFF:
				_ollie.emit('message', packet);
				break;
			case 0xFE:
				_ollie.emit('notification', packet);
				switch (packet.ID_CODE) {
					case 7: (function() {
						// Collision detected
						var DATA = bufferToArray(packet.DATA);
						var DATA2 = {};
						DATA2.X = DATA[0].concat(DATA[1]);
						DATA2.Y = DATA[2].concat(DATA[3]);
						DATA2.Z = DATA[4].concat(DATA[5]);
						DATA2.Axis = DATA[6];
						DATA2.xMagnitute = DATA[7].concat(DATA[8]);
						DATA2.yMagnitute = DATA[9].concat(DATA[10]);
						DATA2.Speed = DATA[11];
						DATA2.Timestamp = DATA[12].concat(DATA[13].concat(DATA[14].concat(DATA[15])));
						for (var prop in DATA2) {
							DATA2[prop] = parseInt(DATA2[prop], 16);
						};
						_ollie.emit('collision', DATA2);
					})(); break;

					case 3: (function(){
						// Sensor Data Streaming
						_ollie.emit('dataStream', bufferToArray(packet.DATA));
					})(); break;
				}
				break;
		}
	});

	process.on('SIGINT', function() {
		_ollie.halt(function(){
			process.exit();
		});
	});

}