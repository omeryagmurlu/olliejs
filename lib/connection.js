// Ollie Connection

var noble = require('noble');
var util = require('util');
var events = require('events');

var Connection = module.exports = function Connection(uuid, opts){
	opts = opts || {};
	this.uuid = uuid;
	this.peripheral;
	this.writeNotify = opts.writeNotify || true;
};

util.inherits(Connection, events.EventEmitter);

Connection.prototype.init = function(callback) {
	noble.on("stateChange", function(state) {
		if (state === "poweredOn") {
			noble.startScanning([]);
		} else {
			noble.stopScanning();
		}
	});

	noble.on("discover", function(peripheral) {
		if (peripheral.id === this.uuid) {
			this.peripheral = peripheral;
			noble.stopScanning();
			// should be connected now
			this.emit('connect', peripheral);
			if (typeof callback !== "undefined") {callback()}
		}
	}.bind(this));
};

// Outsiders

Connection.prototype.writeCharacteristic = function(serviceId, characteristicId, value, callback) {
	this.getCharacteristic(serviceId, characteristicId, function(err, characteristic) {
		if (err) { return callback(err); }

		characteristic.write(new Buffer(value), this.writeNotify, function() {
			callback(null);
		});
	});
}

//Shamelessly taken from cylon-ble

Connection.prototype.getCharacteristic = function(serviceId, characteristicId, callback) {
	var p = this.peripheral;

	p.connect(function() {
		p.discoverServices([serviceId], function(serErr, services) {
			if (serErr) { return callback(serErr); }

			if (services.length > 0) {
				var s = services[0];

				s.discoverCharacteristics([characteristicId], function(charErr, characteristics) {
					if (charErr) { return callback(charErr); }

					var c = characteristics[0];
					callback(null, c);
				});
			} else {
				callback("Service not found", null);
			}
		});
	});
};