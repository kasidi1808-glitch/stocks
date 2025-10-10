# "Module has no exported member 'Quote'" build failure

The TypeScript compiler stops in `components/stocks/markets/columns.tsx` because that file imports a `Quote`
type from `@/types/yahoo-finance`:

```ts
import type { Quote } from "@/types/yahoo-finance"
```

If the module at `types/yahoo-finance.ts` does not actually export a `Quote` symbol, the compiler raises

```
Module '"@/types/yahoo-finance"' has no exported member 'Quote'.
```

So when this error appears it means the version of `types/yahoo-finance.ts` that ended up in the build did not
include the `export type Quote = { ... }` block (for example, because you are on an older commit, you have stale
outputs in `.next`/`tsconfig.tsbuildinfo`, or the file was not committed).
