/* converts any type to unknown type */
type AnyToUnknown<T> = 0 extends 1 & T ? unknown : T;

/**
 * Success result shape.
 * @generic T Success value type
 */
interface Ok<T> {
  error: null;
  value: T;
}

/**
 * Failure result shape.
 * @generic E Failure error type
 */
interface Err<E> {
  error: E;
  value: null;
}

/**
 * Wrapped failure details.
 * @generic E Cause type
 */
interface Exception<E = unknown> {
  cause: E;
}

/**
 * Result union type.
 * @generic T Success value type
 * @generic E Failure error type
 */
type Result<T, E> = Ok<T> | Err<E>;

/**
 * Async result union type.
 * @generic T Success value type
 * @generic E Failure error type
 */
type ResultPromise<T, E> = Promise<Result<T, E>>;

/**
 * Sync callback type.
 * @generic T Return value type
 */
type SyncCallback<T = unknown> = () => T;

/**
 * Async callback type.
 * @generic T Resolved value type
 */
type AsyncCallback<T = unknown> = () => Promise<T>;

/**
 * Creates a success result.
 * @generic T Success value type
 */
function ok<T>(value: T): Ok<T> {
  return { error: null, value };
}

/**
 * Creates an error result.
 * @generic E Failure error type
 */
function err<E>(error: E): Err<E> {
  return { error, value: null };
}

/**
 * Wraps an AsyncCallback.
 * @generic T Resolved value type
 * @generic E Rejected error type
 * @param callback AsyncCallback
 */
function attempt<T, E = unknown>(
  callback: AsyncCallback<T>,
): ResultPromise<AnyToUnknown<T>, Exception<E>>;

/**
 * Wraps a SyncCallback.
 * @generic T Success value type
 * @generic E Failure error type
 * @param callback SyncCallback
 */
function attempt<T, E = unknown>(callback: SyncCallback<T>): Result<AnyToUnknown<T>, Exception<E>>;

/**
 * Wraps a Promise result.
 * @generic T Success value type
 * @generic E Failure error type
 * @param promise Promise operation
 */
function attempt<T, E = unknown>(promise: Promise<T>): ResultPromise<AnyToUnknown<T>, Exception<E>>;

/** Runs sync callback, async callback, or promise execution. */
function attempt(
  operation: SyncCallback<unknown> | AsyncCallback<unknown> | Promise<unknown>,
): Result<unknown, Exception<unknown>> | ResultPromise<unknown, Exception<unknown>> {
  const handleError = (error: unknown): Err<Exception> => err({ cause: error });

  if (operation instanceof Promise) {
    return operation.then(ok).catch(handleError);
  }

  try {
    const value = operation();

    if (value instanceof Promise) {
      return value.then(ok).catch(handleError);
    }

    return ok(value);
  } catch (error) {
    return handleError(error);
  }
}

export { ok, err, attempt };
export type { Ok, Err, Result, Exception, SyncCallback, ResultPromise, AsyncCallback };
