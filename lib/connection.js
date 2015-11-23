// Ollie Connection

var util = require('util');
var events = require('events');

var Connection = module.exports = function Connection(uuid, opts){
	opts = opts || {};
	this.uuid = uuid;
	this.peripheral;
	this.writeNotify = opts.writeNotify || true;
	this.foundedCharacteristics = {};
};

util.inherits(Connection, events.EventEmitter);

Connection.prototype.init = function(callback) {
	this.noble = require('noble');

	this.noble.on("stateChange", function(state) {
		if (state === "poweredOn") {
			this.noble.startScanning([]);
		} else {
			this.noble.stopScanning();
		}
	}.bind(this));

	this.noble.on("discover", function(peripheral) {
		if (peripheral.id === this.uuid) {
			this.peripheral = peripheral;
			this.noble.stopScanning();
			// should be connected now
			this.emit('connect', peripheral);
		}
	}.bind(this));
};

// Outsiders

Connection.prototype.writeCharacteristic = function(serviceId, characteristicId, value, callback) {
	this.getCharacteristic(serviceId, characteristicId, function(err, characteristic) {
		if (err) { return callback(err); }

		characteristic.write(new Buffer(value), this.writeNotify, function() {
			if(callback && typeof callback == "function") {
					callback(null);
			}
		});
	});
};

Connection.prototype.readCharacteristic = function(serviceId, characteristicId, callback) {
	this.getCharacteristic(serviceId, characteristicId, function(err, c) {
		if (err) {
			return callback(err);
		}

		c.read(callback);
	});
};

Connection.prototype.notifyCharacteristic = function(serviceId, characteristicId, state, callback) {
	this.getCharacteristic(serviceId, characteristicId, function(err, c) {
		if (err) { return callback(err); }
		c.notify(state, function(error) {
			c.on("read", function(data, isNotification) {
				callback(error, data, isNotification);
			});
		});
	});
};

//Shamelessly taken from cylon-ble

Connection.prototype.getCharacteristic = function(serviceId, characteristicId, callback) {
	if (this.foundedCharacteristics[serviceId] && this.foundedCharacteristics[serviceId][characteristicId]) {
		return callback(null, this.foundedCharacteristics[serviceId][characteristicId]);
	}

	var p = this.peripheral;
	var that = this;

	p.connect(function() {
		p.discoverServices([serviceId], function(serErr, services) {
			if (serErr) { return callback(serErr); }

			if (services.length > 0) {
				var s = services[0];
				that.foundedCharacteristics[serviceId] = {};

				s.discoverCharacteristics(null, function(charErr, characteristics) {
					if (charErr) { return callback(charErr); }

					for (var i in characteristics) {
						if (characteristics[i].uuid === characteristicId) {
							var c = characteristics[i];
							that.foundedCharacteristics[serviceId][characteristicId] = c;

							callback(null, c);
						}
					};
				});
			} else {
				callback("Service not found", null);
			}
		});
	});
};