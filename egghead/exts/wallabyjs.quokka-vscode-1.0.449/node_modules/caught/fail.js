'use strict';

var p = Promise.reject(0);

setTimeout(() => p.catch(e => console.error('caught')), 0);

