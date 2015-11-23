// Ollie Driver

var packetBuilder = require('./packet-builder'),
	commands = require('./commands');

var util = require('util');
var events = require('events');

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

var Driver = function Driver(_connection, opts){
	opts = opts || {};
	this._connection = _connection;

	this.MotorOff = 0x00;
	this.MotorForward = 0x01;
	this.MotorReverse = 0x02;
	this.MotorBrake = 0x03;
	this.MotorIgnore = 0x04;

	this.mask1 = this.mask2 = 0x00000000;
};

module.exports = function(_connection, opts) {
	return new Driver(_connection, opts);
}

util.inherits(Driver, events.EventEmitter);

Driver.prototype.wake = function(callback) {
	this._connection.writeCharacteristic(
		OllieBLEService,
		WakeMainProcessor,
		1,
		callback
	);
};

Driver.prototype.detectCollisions = function(speed, dead, callback) {
	// Collision speed to detect
	var speed = speed ? speed.toString(16) : '0x50';
	// Wait time before processing next collision in 10 ms
	var dead = dead ? dead.toString(16) : '0x50';
	var packet = commands.api.configureCollisionDetection(0x01, 0x40, 0x40, speed, speed, dead, {resetTimeout: true});
	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setTXPower = function(level, callback) {
	this._connection.writeCharacteristic(OllieBLEService, TXPower, level, callback);
};

Driver.prototype.setRGB = function(color, persist, callback) {
	var packet = commands.api.setRGB(color, persist, {resetTimeout: true});
	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

//ömer
Driver.prototype.setColor = function(color, persist) {
	if (typeof color === "string") { color = Colors.fromString(color); }
	return this.setRGB(color, persist);
};
// ömer
Driver.prototype.setRandomColor = function(persist) {
	return this.setRGB(Colors.randomColor(), persist);
};

Driver.prototype.roll = function(speed, heading, state, callback) {
	this.heading = heading;

	var packet = commands.api.roll(
		speed,
		heading,
		state,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

// ömer
Driver.prototype.setDataStreaming = function(dataSources, opts, callback) {
	opts = opts || {};

	var n = opts.n || 80,
		m = opts.m || 1,
		pcnt = opts.pcnt || 0;

	dataSources.forEach(function(ds) {
		if (DATA_SOURCES1[ds]) {
			this.mask1 = this.mask1 + DATA_SOURCES1[ds];
		}

		if (DATA_SOURCES2[ds]) {
			this.mask2 = this.mask2 + DATA_SOURCES2[ds];
		}
	}.bind(this));
	
	var packet = commands.api.setDataStreaming(n, m, this.mask1, pcnt, this.mask2, {resetTimeout: true});
	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.stop = function(callback) {
	this.roll(0, this.heading, 1, callback); 
};

Driver.prototype.setRawMotorValues = function(lm, lp, rm, rp, callback) {
	var packet = commands.api.setRawMotorValues(
		lm, lp,
		rm, rp,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

 // ömer büyük ekleyiş başlangıç
Driver.prototype.setRotationRate = function(rate, callback) {
	var packet = commands.api.setRotationRate(
		rate,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setBackLED = function(intensity, callback) {
	var packet = commands.api.setBackLED(
		intensity,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setMotionTimeout = function(time, callback) {
	var packet = commands.api.setMotionTimeout(
		time,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setTemporaryOptionFlags = function(flag, callback) {
	var packet = commands.api.setTemporaryOptionFlags(
		flag,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getTemporaryOptionFlags = function(callback) {
	var packet = commands.api.getTemporaryOptionFlags(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getPermanentOptionFlags = function(callback) {
	var packet = commands.api.getPermanentOptionFlags(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.runMacro = function(macroID, callback) {
	var packet = commands.api.runMacro(
		macroID,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.saveTemporaryMacro = function(macro, callback) {
	var packet = commands.api.saveTemporaryMacro(
		macro,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.savePermanentMacro = function(macro, callback) {
	var packet = commands.api.saveMacro(
		macro,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.reInitializeMacroExecutive = function(callback) {
	var packet = commands.api.reInitializeMacroExecutive(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.abortMacro = function(callback) {
	var packet = commands.api.abortMacro(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.eraseOrbBasicStorage = function(area, callback) {
	var packet = commands.api.eraseOrbBasicStorage(
		area,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.appendOrbBasicFragment = function(area, fragment, callback) {
	var packet = commands.api.appendOrbBasicFragment(
		area,
		fragment,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.executeOrbBasicProgram = function(area, startLine, callback) {
	var packet = commands.api.executeOrbBasicProgram(
		area,
		startLine,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.abortOrbBasicProgram = function(callback) {
	var packet = commands.api.abortOrbBasicProgram(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.submitValueToInputStatement = function(value, callback) {
	var packet = commands.api.submitValueToInputStatement(
		value,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

// ömer bundan sonrasını (büyük ekleyiş sona kadar olan) ben istediğimden yazmadım

Driver.prototype.appendMacroChunck = function(macro, callback) {
	var packet = commands.api.appendMacroChunck(
		macro,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setMacroParameter = function(parameter, value, callback) {
	var packet = commands.api.setMacroParameter(
		parameter,
		value,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getMacroStatus = function(callback) {
	var packet = commands.api.getMacroStatus(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getDeviceMode = function(callback) {
	var packet = commands.api.getDeviceMode(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

// ömer yapilmayan yapılmayan yapmadı setConfigurationBlock tehlikeli olduğundan (heralde)

// ömer yapilmayan yapılmayan yapmadı setDeviceMode gereksiz olduğundan (heralde)

// ömer yapilmayan yapılmayan yapmadı setAccelerometerRange gereksiz olduğundan (heralde)

// ömer yapilmayan yapılmayan yapmadı selfLevel anlamadığından olduğundan (heralde)

Driver.prototype.getConfigurationBlock = function(conBlockID, callback) {
	var packet = commands.api.getConfigurationBlock(
		conBlockID,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getRGB = function(callback) {
	var packet = commands.api.getRGB(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.readLocator = function(callback) {
	var packet = commands.api.readLocator(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.configureLocator = function(flags, x, y, yawTare, callback) {
	var packet = commands.api.configureLocator(
		flags,
		x,
		y,
		yawTare,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getChassisID = function(callback) {
	var packet = commands.api.getChassisID(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

// gerisi core

Driver.prototype.ping = function(callback) {
	var packet = commands.core.ping(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getVersioning = function(callback) {
	var packet = commands.core.getVersioning(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getBluetoothInfo = function(callback) {
	var packet = commands.core.getBluetoothInfo(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setAutoReconnect = function(enable, time, callback) {
	var packet = commands.core.setAutoReconnect(
		enable,
		time,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getAutoReconnect = function(callback) {
	var packet = commands.core.getAutoReconnect(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getPowerState = function(callback) {
	var packet = commands.core.getPowerState(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setPowerNotification = function(enable, callback) {
	var packet = commands.core.setPowerNotification(
		enable,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.sleep = function(wakeup, macro, orbBasic, callback) {
	var packet = commands.core.sleep(
		wakeup,
		macro,
		orbBasic,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.getVoltageTripPoints = function(callback) {
	var packet = commands.core.getVoltageTripPoints(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setInactivityTimeout = function(time, callback) {
	var packet = commands.core.setInactivityTimeout(
		time,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.performLevel1Diagnostics = function(callback) {
	var packet = commands.core.performLevel1Diagnostics(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.performLevel2Diagnostics = function(callback) {
	var packet = commands.core.performLevel1Diagnostics(
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

// ömer büyük ekleyiş son

Driver.prototype.setHeading = function(num, callback) {
	var packet = commands.api.setHeading(
		num,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};

Driver.prototype.setStabilization = function(value, callback) {
	var packet = commands.api.setHeading(
		value,
		{ resetTimeout: true }
	);

	this._connection.writeCharacteristic(OllieRobotControlService,
		Roll,
		packet,
		callback
	);
};



// ömer
Driver.prototype.startCalibration = function() {
	this.setBackLED(127);
	this.setStabilization(0);
};

Driver.prototype.finishCalibration = function() {
	this.setBackLED(0);
	this.setHeading(0);
	this.setStabilization(1);
};

Driver.prototype.devModeOn = function(callback) {
	console.log("Putting Ollie into dev mode.");
	console.log("Sending anti-DoS string.");

	this.setAntiDos(function() {
		console.log("Anti-DoS sent.");
		console.log("Sending Wake");

		this.wake(function(err, data) {
			console.log("Wake sent.");
			callback(err, data);
		});
	}.bind(this));
};

Driver.prototype.setAntiDos = function(callback) {
	var str = "011i3";
	var bytes = [];

	for (var i = 0; i < str.length; ++i) {
		bytes.push(str.charCodeAt(i));
	}

	this._connection.writeCharacteristic(OllieBLEService, AntiDos, bytes, callback);
};