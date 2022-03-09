node caught
===========

[![npm install][install-img]][npm-url]
<br>
[![Build Status][travis-img]][travis-url]
[![Dependencies Status][david-img]][david-url]
[![Known Vulnerabilities][snyk-img]][snyk-url]
[![Downloads][downloads-img]][stats-url]
[![License][license-img]][license-url]

This module lets you attach empty rejcetion handlers to promises
to avoid certain warnings that will be fatal errors
in next versions of Node.

Since version 0.1.0 it supports TypeScript
thanks to [Wil Lee](https://github.com/kourge).

For a version for [Deno](https://deno.land/),
see: https://deno.land/x/caught

More info
-
Doing something like this:

```js
var p = Promise.reject(0);

setTimeout(() => p.catch(e => console.error('caught')), 0);
```

will generate a lot of helpful warnings:

```
(node:13548) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): 0
(node:13548) DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
(node:13548) PromiseRejectionHandledWarning: Promise rejection was handled asynchronously (rejection id: 1)
```

This module lets you write:

```js
var p = caught(Promise.reject(0));

setTimeout(() => p.catch(e => console.error('caught')), 0);
```

to ignore those warnings on a per-promise basis.

Use at your own risk.

Background
-
For more info see this answer on Stack Overflow:

* [**Should I refrain from handling Promise rejection asynchronously?**](https://stackoverflow.com/questions/40920179/should-i-refrain-from-handling-promise-rejection-asynchronously/40921505#40921505)

Installation
------------
To use in your projects:

```sh
npm install caught --save
```

Usage
-----
```js
var caught = require('caught');

var p = caught(Promise.reject(0));
```

Note that it is not the same as writing:

```js
var p = Promise.reject(0).catch(() => {});
```

which would not return the original promise and wouldn't let you add `catch` handlers later.

Issues
------
For any bug reports or feature requests please
[post an issue on GitHub][issues-url].

Author
------
[**Rafał Pocztarski**](https://pocztarski.com/)
<br/>
[![Follow on GitHub][github-follow-img]][github-follow-url]
[![Follow on Twitter][twitter-follow-img]][twitter-follow-url]
<br/>
[![Follow on Stack Exchange][stackexchange-img]][stackoverflow-url]

Contributors
------------
* [Wil Lee](https://github.com/kourge) (added TypeScript support in [PR #1](https://github.com/rsp/node-caught/pull/1))

License
-------
MIT License (Expat). See [LICENSE.md](LICENSE.md) for details.

[npm-url]: https://www.npmjs.com/package/caught
[github-url]: https://github.com/rsp/node-caught
[readme-url]: https://github.com/rsp/node-caught#readme
[issues-url]: https://github.com/rsp/node-caught/issues
[license-url]: https://github.com/rsp/node-caught/blob/master/LICENSE.md
[travis-url]: https://travis-ci.org/rsp/node-caught
[travis-img]: https://travis-ci.org/rsp/node-caught.svg?branch=master
[snyk-url]: https://snyk.io/test/github/rsp/node-caught
[snyk-img]: https://snyk.io/test/github/rsp/node-caught/badge.svg
[david-url]: https://david-dm.org/rsp/node-caught
[david-img]: https://david-dm.org/rsp/node-caught/status.svg
[install-img]: https://nodei.co/npm/caught.png?compact=true
[downloads-img]: https://img.shields.io/npm/dt/caught.svg
[license-img]: https://img.shields.io/npm/l/caught.svg
[stats-url]: http://npm-stat.com/charts.html?package=caught
[github-follow-url]: https://github.com/rsp
[github-follow-img]: https://img.shields.io/github/followers/rsp.svg?style=social&logo=github&label=Follow
[twitter-follow-url]: https://twitter.com/intent/follow?screen_name=pocztarski
[twitter-follow-img]: https://img.shields.io/twitter/follow/pocztarski.svg?style=social&logo=twitter&label=Follow
[stackoverflow-url]: https://stackoverflow.com/users/613198/rsp
[stackexchange-url]: https://stackexchange.com/users/303952/rsp
[stackexchange-img]: https://stackexchange.com/users/flair/303952.png
