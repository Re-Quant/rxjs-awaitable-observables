# RxJS Awaitable Observables

<p align="center">
  <a target="_blank" href="https://github.com/z-brain/rxjs-awaitable-observables/actions?query=workflow%3A%22Build%22">
    <img alt="Build status" src="https://github.com/z-brain/rxjs-awaitable-observables/workflows/Build/badge.svg">
  </a>
  <a target="_blank" href="https://www.npmjs.com/package/@z-brain/rxjs-awaitable-observables">
    <img alt="NPM version" src="https://img.shields.io/npm/v/@z-brain/rxjs-awaitable-observables.svg">
  </a>
  <a target="_blank" href="https://codecov.io/gh/z-brain/rxjs-awaitable-observables">
    <img alt="Code Coverage" src="https://codecov.io/gh/z-brain/rxjs-awaitable-observables/branch/master/graph/badge.svg">
  </a>
  <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0">
    <img alt="License: GPL v3" src="https://img.shields.io/badge/License-GPLv3-blue.svg">
  </a>
</p>

<p align="center">🧨 &nbsp;&nbsp; 💥 &nbsp;&nbsp; 💪 &nbsp;&nbsp; <strong>Use `async`/`await` with any RxJS stream and be happy</strong> &nbsp;&nbsp; ✅ &nbsp;&nbsp; 👨‍💻 &nbsp;&nbsp; 😎</p>

<p align="center"><i>Notice: If you have any propositions feel free to make an issue or create a pull request.</i></p>

## Installation

### 1. Install the package

`yarn add @z-brain/rxjs-awaitable-observables`  
or  
`npm i -s @z-brain/rxjs-awaitable-observables`

### 2. Add the import line of the package to your entry .ts files

Your `main.ts`:
```typescript
import '@z-brain/rxjs-awaitable-observables';
```

That is all 🙂&nbsp; Feel free to use async/await with observables 😉

**Detailed description:**

* In case of Angular project it can be `main.ts`
* In case of a server project it is the entry file of your server app (`index.ts` or `server.ts` in most cases)

### 3. Configure you testing framework

If you are going to use async/await with observables in any kind of your tests (unit / e2e) there are two ways to do it:  

1. Add a setup file with the import to you testing framework. In case of `Jest` it can be done via `setupFiles` or `setupFilesAfterEnv`. **(recommended)**

  ```javascript
  // jest.config.js
  module.exports = {
  ...
  setupFiles: [ './jest.setup.ts' ],
  ...
  };
  
  // jest.setup.ts
  import '@z-brain/rxjs-awaitable-observables';
  ```
2. Or you can manually import the package to each of your test **(unrecommended)**

## Usage examples

**1. Simple example: async/await works with completed observables**

```typescript
const value$ = $$.of(123);
const value = await value$;
expect(value).toBe(123);
```

**2. Take the first value in the stream**
```typescript
const value$: Observable<number> = $$.of(111, 222, 333);
const value = await value$;
expect(value).toBe(111);
```

**3. Takes the last value of a completed stream**
```typescript
const value$: Observable<number> = $$.of(111, 222, 333);
const value = await value$.pipe($.last());
expect(value).toBe(333);
```

**4. Take the initial value of `Subject` + `.startWith()`**
```typescript
      const newValues$: Observable<number> = new Subject<number>();
      const value$ = newValues$.pipe($.startWith(123));

      const value = await value$;
      expect(value).toBe(123);
```

**5. Take the first value of `ReplaySubject`**
```typescript
const value$ = new ReplaySubject<number>(2);
value$.next(111);
value$.next(222);
value$.next(333);
value$.next(444);

const value = await value$;

expect(value).toBe(333);
```

**6. Error handling using try/catch**
```typescript
const MSG = 'Something went wrong';
const err$ = $$.throwError(new Error(MSG));

try {
  await err$;
} catch (e) {
  expect(e.message).toMatch(MSG);
}
```

**7. Manually .then() call (Promises integration)**
```typescript
const value$: Observable<number> = $$.of(123);

const promise = Promise.resolve(10)
                       .then(multiplier => value$.then(v => v * multiplier));

return expect(promise).resolves.toBe(1230);
```

## How does it work?

* This package patches `Observables`'s prototype and adds `.then()` method to make all `Observable`s and its children work with `async`/`await` as is without the necessary to call `.toPromise()`
* Yes, the package patches .prototype of another package (RxJS).  
  In theory, it can be dangerous. However, this package does it enough carefully.  
  We already saw some successful examples of patching .prototype even build-in functions. (Zone.js for example)  
  I suggest don't afraid and make our daily work easier and our code more beautiful.

**100% test coverage**:  
```
async/await tests
  ✅ async/await should work with completed observables
  ✅ Should take the first value in the stream
  ✅ Should take the last value of a completed stream
  ✅ Should take the current value of BehaviorSubject
  ✅ Should take the initial value of Subject + .startWith()
  ✅ Should take the first value of ReplaySubject
  ✅ try/catch should handle an error from the stream via async/await
Check integration with Promises
  ✅ Should work with manually .then() call
```

## Development notes

### Quick Start

```bash
cd /code/z-brain
git clone git@github.com:z-brain/rxjs-awaitable-observables.git
cd rxjs-awaitable-observables
yarn install
```

### How to use NodeJS version from the `.nvmrc`

1. Install NVM
2. Use `.nvmrc` file one of the next ways:

    * Execute `nvm use` in the project root directory
    * Install [NVM Loader](https://github.com/korniychuk/ankor-shell) and your .nvmrc will be loaded automatically when you open the terminal.
      ![NVM Loader demo](./resources/readme.nvm-loader.png)

### How to make a build

`npm run build`

### How to run lint

* Just show problems `npm run lint`
* Fix problems if it is possible `npm run lint:fix`

### How to run tests

* All tests

  `npm run test`  
  `npm run test:watch`
* Specific tests

  `npm run test -- src/my.spec.ts`  
  `npm run test:watch -- src/my.spec.ts`

### How to build and publish NPM package

*NPM Token:* `1cda...0558`

CI configuration details here: [.github/workflows/npmpublish.yml](.github/workflows/npmpublish.yml)

```bash
npm run pre-push
&& npm version patch -m 'Update package version version to %s'
&& npm run gen-public-package.json
&& cp README.md dist/
&& npm publish dist --access public
&& git push --no-verify && git push --tags --no-verify
```

### How to build package to local installation

1. `yarn run build:local`
2. Then you can install a local package build from path `file:.../rxjs-awaitable-observables/dist`.

## Author

| [<img src="https://www.korniychuk.pro/avatar.jpg" width="100px;"/><br /><sub>Anton Korniychuk</sub>](https://korniychuk.pro) |
| :---: |
