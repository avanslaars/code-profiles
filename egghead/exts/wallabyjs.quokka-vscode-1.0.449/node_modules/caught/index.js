'use strict';

module.exports = (f => p => (p.catch(f), p))(() => {});

