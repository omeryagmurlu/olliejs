'use strict'

var events = require('events'),
	util = require('util');

var Ollie = module.exports = function(uuid, opts) {
	var opts = opts || {};
	this.uuid = uuid;
	this.connection  = new (require('./connection'))(this.uuid);
	this.driver = require('./driver')(this.connection);
	this.responseParser = require('./response-parser').spheroResponseParser();
	this.events = require('./events');
}

util.inherits(Ollie, events.EventEmitter);

// Static Methods

Ollie.bufferToArray = require('./toolbelt').bufferToArray;
Ollie.bufferArrayToDecimal = require('./toolbelt').bufferArrayToDecimal;

// Pub/Priv Methods

Ollie.prototype.init = function(callback) {
	this.events.load(this);
	this.connection.init(callback);
};