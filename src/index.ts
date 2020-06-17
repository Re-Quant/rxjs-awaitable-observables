import { Observable, Subscription, EmptyError } from 'rxjs';

declare module 'rxjs' {
  export interface Observable<T> {
    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): Promise<TResult1 | TResult2>;
  }
}

Observable.prototype.then = function then(
  onFulfilled?: ((value: any) => any) | undefined | null,
  onRejected?: ((reason: any) => any) | undefined | null,
) {
  return new Promise((resolve, reject) => {
    const subs = new Subscription();
    subs.add(
      this.subscribe({
        next: (value) => {
          resolve(onFulfilled ? onFulfilled(value) : value);
          subs.unsubscribe();
        },
        error: (err) => {
          reject(onRejected ? onRejected(err) : err);
        },
        complete: () => {
          const err = new EmptyError();
          reject(onRejected ? onRejected(err) : err);
        },
      }),
    );
  });

};
