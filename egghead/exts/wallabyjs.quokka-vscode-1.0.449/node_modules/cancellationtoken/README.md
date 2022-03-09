# Cancellation Token

[![npm](https://img.shields.io/npm/v/cancellationtoken.svg?style=flat-square)](https://www.npmjs.com/package/cancellationtoken)

Cancellation tokens are composable entities that allow cancelling asynchronous operations.

The implementation roughly follows these TC39 proposals:

- https://github.com/tc39/proposal-cancellation
- https://github.com/tc39/proposal-cancelable-promises

The implementation is written in TypeScript and therefore comes with typings already bundled.

## Installation

Install the library via your favourite package manager.

```
npm install cancellationtoken
```

or

```
yarn add cancellationtoken
```

## Usage

You can create a new cancellation token along with a function to cancel it via `create`. Functions can consume tokens by accessing the `ìsCancelled` property.

```
import CancellationToken from 'cancellationtoken'

const { cancel, token } = CancellationToken.create()
console.log(token.isCancelled) // prints false
cancel()
console.log(token.isCancelled) // prints true
```

## Documentation

Coming soon! Meanwhile you can use the TypeScript definitions and examples.

## Examples

```
git clone https://github.com/conradreuter/cancellationtoken
cd cancellationtoken/
yarn
yarn example 01-usage
```

## Contributors

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/6838728?v=4" width="100px;"/><br /><sub><b>conradreuter</b></sub>](https://github.com/conradreuter)<br />[💻](https://github.com/conradreuter/cancellationtoken/commits?author=conradreuter "Code") [📖](https://github.com/conradreuter/cancellationtoken/commits?author=conradreuter "Documentation") [💡](#example-conradreuter "Examples") [⚠️](https://github.com/conradreuter/cancellationtoken/commits?author=conradreuter "Tests") | [<img src="https://avatars2.githubusercontent.com/u/3548?v=4" width="100px;"/><br /><sub><b>Andrew Arnott</b></sub>](http://blog.nerdbank.net)<br />[💻](https://github.com/conradreuter/cancellationtoken/commits?author=AArnott "Code") [🐛](https://github.com/conradreuter/cancellationtoken/issues?q=author%3AAArnott "Bug reports") [📖](https://github.com/conradreuter/cancellationtoken/commits?author=AArnott "Documentation") [⚠️](https://github.com/conradreuter/cancellationtoken/commits?author=AArnott "Tests") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-end -->
