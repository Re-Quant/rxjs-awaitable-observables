import * as $ from 'rxjs/operators';
import * as $$ from 'rxjs';
import { Observable, BehaviorSubject, Subject, ReplaySubject, EmptyError } from 'rxjs';

import './index';

describe('RxJS awaitable Observables', () => {
  describe('async/await tests', () => {
    it('async/await should work with completed observables', async () => {
      // arrange
      const value$: Observable<number> = $$.of(123);

      // act
      const value = await value$; /* ? */

      // assert
      expect(value).toBe(123);
    });

    it('Should take the first value in the stream', async () => {
      // arrange
      const value$: Observable<number> = $$.of(111, 222, 333);

      // act
      const value = await value$;

      // assert
      expect(value).toBe(111);
    });

    it('Should take the last value of a completed stream', async () => {
      // arrange
      const value$: Observable<number> = $$.of(111, 222, 333);

      // act
      const value = await value$.pipe($.last());

      // assert
      expect(value).toBe(333);
    });

    it('Should take the current value of BehaviorSubject', async () => {
      // arrange
      const value$: Observable<number> = new BehaviorSubject(123);

      // act
      const value = await value$;

      // assert
      expect(value).toBe(123);
    });

    it('Should take the initial value of Subject + .startWith()', async () => {
      // arrange
      const newValues$: Observable<number> = new Subject<number>();
      const value$ = newValues$.pipe($.startWith(123));

      // act
      const value = await value$;

      // assert
      expect(value).toBe(123);
    });

    it('Should take the first value of ReplaySubject', async () => {
      // arrange
      const value$ = new ReplaySubject<number>(2);
      value$.next(111);
      value$.next(222);
      value$.next(333);
      value$.next(444);

      // act
      const value = await value$;

      // assert
      expect(value).toBe(333);
    });

    it('try/catch should handle an error from the stream via async/await', async () => {
      // arrange
      const MSG = 'Something went wrong';
      const err$ = $$.throwError(new Error(MSG));

      // act
      try {
        await err$;
      } catch (e) {
        // assert
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect((e as Error).message).toMatch(MSG);
      }
    });

    it('Should throw an EmptyError.name on completing observable without a message', async () => {
      // arrange
      const emptyStream$ = $$.EMPTY;

      try {
        // act
        await emptyStream$;
      } catch (e) {
        // assert
        expect(e).toBeInstanceOf(EmptyError);
      }

    });
  });

  describe('Check integration with Promises', () => {

    it('Should work with manually .then() call', () => {
      // arrange
      const value$: Observable<number> = $$.of(111);
      const multiplayer10$ = new BehaviorSubject(10);
      const multiplayer2$ = new ReplaySubject<number>(1); multiplayer2$.next(2);

      // act
      const promise = Promise
          // 1. Passing an rxjs stream to Promise.resolve
          .resolve(multiplayer10$)
          // 2. Returning a sync value from 'then'
          .then(a => multiplayer2$.then(b => a * b))
          // 3. Returning a promise from 'then'
          .then(multiplier => value$.then(v => Promise.resolve(v * multiplier)));

      // assert
      return expect(promise).resolves.toBe(2220);
    });

    it('Empty .then() call should just return a promise with the value without any errors', () => {
      // arrange
      const value$ = $$.of(111);

      // act
      const value = value$.then();

      // assert
      return expect(value).resolves.toBe(111);
    });

    it('In case of error in the stream empty .then() call should do nothing and return rejected promise with the error', () => {
      // arrange
      const value$ = $$.throwError(new Error('My Error'));

      // act
      const value = value$.then();

      // assert
      return expect(value).rejects.toThrowError('My Error');
    });

  });
});
