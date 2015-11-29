// Ollie Driver

var commands = require('./commands');

var OllieBLEService = "22bb746f2bb075542d6f726568705327",
	WakeMainProcessor = "22bb746f2bbf75542d6f726568705327",
	TXPower = "22bb746f2bb275542d6f726568705327",
	AntiDos = "22bb746f2bbd75542d6f726568705327",
	OllieRobotControlService = "22bb746f2ba075542d6f726568705327",
	Roll = "22bb746f2ba175542d6f726568705327",
	Notify = "22bb746f2ba675542d6f726568705327";

var DATA_SOURCES1 = {
	motorsPWM: 0x00180000,
	imu: 0x00070000,
	accelerometer: 0x0000E000,
	gyroscope: 0x00001C00,
	motorsIMF: 0x00000060
};

var DATA_SOURCES2 = {
	quaternion: 0xF0000000,
	odometer: 0x0C000000,
	accelOne: 0x02000000,
	velocity: 0x01800000
};

var MOTOR_MODES = {
	Off: 0x00,
	Forward: 0x01,
	Reverse: 0x02,
	Brake: 0x03,
	Ignore: 0x04
}

module.exports = function(_ollie, opts) {
	return new Driver(_ollie, opts);
}

var Driver = function Driver(_ollie, opts){
	opts = opts || {};
	this.ollie = _ollie;

	//mutators
	insertComms(this.ollie);
	manualComms(this.ollie);

};

var manualComms = function(_ollie){
	Driver.prototype.wake = _ollie.wake = function(callback) {	//When writing these manual override functions,
		_ollie.connection.writeCharacteristic(					//there was something I had to know, 
			OllieBLEService,									//when I would have used 'this.ollie' instead of '_ollie'
			WakeMainProcessor,									//they would only work if I had called them from 'ollie.driver' 
			1,													//wenn ich sie von der 'ollie' gerufen hätte, dann hätten sie nicht funktioniren.
			callback
		);
	};

	Driver.prototype.detectCollisions = _ollie.detectCollisions = function(speed, dead, callback) {
		// Collision speed to detect
		var speed = speed ? speed.toString(16) : '0x50';
		// Wait time before processing next collision in 10 ms
		var dead = dead ? dead.toString(16) : '0x50';
		var packet = commands.api.configureCollisionDetection(0x01, 0x40, 0x40, speed, speed, dead, {resetTimeout: true, requestAcknowledgement: true});
		_ollie.connection.writeCharacteristic(OllieRobotControlService,
			Roll,
			packet,
			callback
		);
	};

	Driver.prototype.setTXPower = _ollie.setTXPower = function(level, callback) {
		_ollie.connection.writeCharacteristic(OllieBLEService, TXPower, level, callback);
	};

	//ömer
	Driver.prototype.setColor = _ollie.setColor = function(color, persist) { //not implemented yet
		if (typeof color === "string") { color = Colors.fromString(color); }
		return _ollie.setRGB(color, persist);
	};
	// ömer
	Driver.prototype.setRandomColor = _ollie.setRandomColor = function(persist) {
		return _ollie.setRGB((Math.floor(Math.random() * (16777215 - 0 + 1)) + 0).toString(16));
	};

	// ömer
	Driver.prototype.setDataStreaming = _ollie.setDataStreaming = function(dataSources, opts, callback) {
		opts = opts || {};

		var n = opts.n || 80,
			m = opts.m || 1,
			pcnt = opts.pcnt || 0;

		var mask1, mask2;
		mask2 = mask1 = 0x00000000;

		dataSources.forEach(function(ds) {
			if (DATA_SOURCES1[ds]) {
				mask1 = mask1 + DATA_SOURCES1[ds];
			}

			if (DATA_SOURCES2[ds]) {
				mask2 = mask2 + DATA_SOURCES2[ds];
			}
		});
		
		var packet = commands.api.setDataStreaming(n, m, mask1, pcnt, mask2, {resetTimeout: true, requestAcknowledgement: true});
		_ollie.connection.writeCharacteristic(OllieRobotControlService,
			Roll,
			packet,
			callback
		);
	};

	Driver.prototype.setRawMotorValues = _ollie.setRawMotorValues = function(lm, lp, rm, rp, callback) {
		lm = MOTOR_MODES[lm];
		rm = MOTOR_MODES[rm];

		var packet = commands.api.setRawMotorValues(
			lm, lp,
			rm, rp,
			{ resetTimeout: true, requestAcknowledgement: true }
		);

		_ollie.connection.writeCharacteristic(OllieRobotControlService,
			Roll,
			packet,
			callback
		);
	};

	Driver.prototype.stop = _ollie.stop = function(callback) {
		_ollie.roll(0, _ollie.driver.heading, 1, callback); 
	};

	// ömer
	Driver.prototype.startCalibration = _ollie.startCalibration = function() {
		_ollie.setBackLED(127);
		_ollie.setStabilization(0);
	};

	Driver.prototype.finishCalibration = _ollie.finishCalibration = function() {
		_ollie.setBackLED(0);
		_ollie.setHeading(0);
		_ollie.setStabilization(1);
	};

	Driver.prototype.devModeOn = _ollie.devModeOn = function(callback) {
		console.log("Putting Ollie into dev mode.");
		console.log("Sending anti-DoS string.");

		_ollie.setAntiDos(function() {
			console.log("Anti-DoS sent.");
			console.log("Sending Wake");

			_ollie.wake(function(err, data) {
				console.log("Wake sent.");
				callback(err, data);
			});
		});
	};

	Driver.prototype.setAntiDos = _ollie.setAntiDos = function(callback) {
		var str = "011i3";
		var bytes = [];

		for (var i = 0; i < str.length; ++i) {
			bytes.push(str.charCodeAt(i));
		}

		_ollie.connection.writeCharacteristic(OllieBLEService, AntiDos, bytes, callback);
	};
};

var insertComms = function(_ollie, callback){
	var interceptor = function(_ollie, func) { //inspired (mostly ported) from alchemycs/spheron
		return function() {
			var options;
			var args = Array.prototype.slice.call(arguments);
			if (typeof args[args.length-1] === 'function') {
				var callback = args.pop();
			} else {
				callback = function(){};
			}
			args.push({
				resetTimeout: true,
				requestAcknowledgement: true
			})
			var packet = func.apply(this, args);
			_ollie.connection.writeCharacteristic(OllieRobotControlService, Roll, packet, callback);
		};
	};

	for (func in commands.core) {
		if (commands.core.hasOwnProperty(func) && typeof commands.core[func] === 'function') {
			Driver.prototype[func] = _ollie[func] = interceptor(_ollie, commands.core[func]);
		}
	}

	for (func in commands.api) {
		if (commands.api.hasOwnProperty(func) && typeof commands.api[func] === 'function') {
			Driver.prototype[func] = _ollie[func] = interceptor(_ollie, commands.api[func]);
		}
	}
}