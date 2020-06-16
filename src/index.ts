import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

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
  return this.pipe(first()).toPromise().then(onFulfilled, onRejected);
};
