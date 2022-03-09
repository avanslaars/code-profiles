'use strict';

var caught = require('.');

var p = caught(Promise.reject(0));

setTimeout(() => p.catch(e => console.error('caught')), 0);

