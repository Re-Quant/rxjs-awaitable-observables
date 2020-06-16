import * as $ from 'rxjs/operators';
import * as $$ from 'rxjs';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';

import './index';

describe('RxJS awaitable Observables', () => {
  describe('async/await tests', () => {
    it('async/await should work with completed observables', async () => {
      // arrange
      const value$: Observable<number> = $$.of(123);

      // act
      const value = await value$;

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
        expect(e.message).toMatch(MSG);
      }
    });
  });

  describe('Check integration with Promises', () => {

    it('Should work with manually .then() call', () => {
      // arrange
      const value$: Observable<number> = $$.of(123);

      // act
      const promise = Promise.resolve(10)
          .then(multiplier => value$.then(v => v * multiplier));

      // assert
      return expect(promise).resolves.toBe(1230);
    });

  });

});
