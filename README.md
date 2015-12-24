[![npm version](https://badge.fury.io/js/olliejs.svg)](https://badge.fury.io/js/olliejs)

###### Even More IMPORTANT

I tried to port my ollie-controller project to sphero.js's new in development code but the interval of sending commands was huge, so I will keep updating this until they fix it. I also opened a new branch in controller's repository.

####IMPORTANT

Finally the "offical" unoffical sphero.js repository started to support Ollie and BB8. Their code is working well with my Ollie and this repository (ollie.js) won't get any further updates (I may update it just out of sheer curiosity, but that's all), so, do not use this reposity, it is obsolete now. Use this instead [sphero.js::feature-ble](https://github.com/orbotix/sphero.js/tree/feature/ble)

But if you still want to use this, then use it :D, it is still working fine.
## OllieJS
A Javascript API for Sphero (Orbotix) Ollie (a working one).

API is able get messages from Ollie, parse them (thank you alchemycs), send commands to Ollie (with a maximum latency of 10 ms ('colors.js' example) with the crappy bluetooth dongle of my laptop :D ).

Check out the [controller](https://github.com/omeryagmurlu/ollie-controller) I wrote for Ollie with this SDK

##Missing things :(

* ~~Sync Messages~~
* appendOrbBasicFragment Function
* Macros