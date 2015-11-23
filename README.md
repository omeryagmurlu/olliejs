[![npm version](https://badge.fury.io/js/olliejs.svg)](https://badge.fury.io/js/olliejs)

## OllieJS
A Javascript API for Sphero (Orbotix) Ollie (a working one).

API is able get messages from Ollie, parse them (thank you alchemycs), send commands to Ollie (with a maximum latency of 10 ms ('colors.js' example) with the crappy bluetooth dongle of my laptop :D ).

##Soon, but not now.

* Macros and orbbasic (they're already done for sphero, just a matter of porting)
* Tell me your ideas in issues.

##Missing things :(

* Sync Messages

Right now this API is only able to get Async messages which are defined in this file [Orbotix Communication](https://s3.amazonaws.com/docs.gosphero.com/api/Sphero_API_1.20.pdf). I've tried hard to get the Sync messages, but they didn't even pop as an unknown read on my screen. I will try to get them working, but the most needed datas (sensor data) are sent with async already, so this shouldn't be a big problem. 