# bye-exceptions

Tiny Result pattern for explicit, type-safe error handling in TypeScript.

Instead of throwing, wrap operations in `attempt` and handle `{ error, value }` results.

## Install

```bash
npm install bye-exceptions
```

## Usage

### Sync

```ts
import { attempt } from "bye-exceptions";

const result = attempt(() => JSON.parse('{"ok": true}'));

if (result.error) {
  console.error(result.error.cause);
} else {
  console.log(result.value);
}
```

### Async

```ts
const result = await attempt(async () => {
  const res = await fetch("/api/user");
  return res.json();
});

if (result.error) {
  // handle failure
} else {
  // result.value is typed
}
```

### Promise

```ts
const result = await attempt(fetch("/api/user").then((r) => r.json()));
```

### Writing a result function

```ts
import { ok, err, type Result } from "bye-exceptions";

function divide(a: number, b: number): Result<number, "division_by_zero"> {
  if (b === 0) return err("division_by_zero");
  return ok(a / b);
}

const result = divide(10, 2);

if (result.error) {
  console.error(result.error); // "division_by_zero"
} else {
  console.log(result.value); // 5
}
```

## API

| Export                   | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `attempt(fn \| promise)` | Runs sync/async code or a promise; returns `Result` or `ResultPromise` |
| `ok(value)`              | Creates a success result                                               |
| `err(error)`             | Creates a failure result                                               |

### Types

- `Result<T, E>` — `{ error: null, value: T }` or `{ error: E, value: null }`
- `Exception<E>` — `{ cause: E }` (error shape from `attempt`)
- `Ok<T>`, `Err<E>`, `ResultPromise<T, E>`

## License

MIT
