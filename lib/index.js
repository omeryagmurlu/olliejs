'use strict'

var events = require('events'),
	util = require('util');

var Ollie = module.exports = function(uuid, opts) {
	var opts = opts || {};
	this.uuid = uuid;
	this.connection  = require('./connection')(this.uuid);
	this.driver = require('./driver')(this);

	// load da events
	require('./events').load(this);
}

util.inherits(Ollie, events.EventEmitter);

// Static Methods

Ollie.bufferToArray = require('./toolbelt').bufferToArray;
Ollie.bufferArrayToDecimal = require('./toolbelt').bufferArrayToDecimal;

// Privileged Methods

Ollie.prototype.init = function(callback) {
	this.connection.init(callback);
};

Ollie.prototype.halt = function(callback) {
	this.driver.sleep(0,undefined,undefined,function(){
		this.connection.halt(function(){
			callback();
		}.bind(this));
	}.bind(this));
};