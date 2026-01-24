---
name: evlog
description: Review code for logging patterns and suggest evlog adoption. Detects console.log spam, unstructured errors, and missing context. Guides wide event design, structured error handling, and request-scoped logging.
license: MIT
metadata:
  author: HugoRCD
  version: "0.1"
---

# evlog - Better Logging Through Wide Events

Review and improve logging patterns in TypeScript/JavaScript codebases. Transform scattered console.logs into structured wide events and convert generic errors into self-documenting structured errors.

## When to Use

**Use this skill when:**

- Reviewing code for logging best practices
- User asks to improve their logging
- Converting console.log statements to structured logging
- Improving error handling with better context
- Setting up request-scoped logging in API routes
- Debugging why logs are hard to search/filter

**Key transformations:**

- `console.log` spam → wide events with `useLogger(event)`
- `throw new Error('...')` → `defineError({ message, why, fix })`
- Scattered request logs → `useLogger(event)` (Nuxt/Nitro) or `createRequestLogger()` (standalone)

## Quick Reference

| Working on...           | Load file                                                          |
| ----------------------- | ------------------------------------------------------------------ |
| Wide events patterns    | [references/wide-events.md](references/wide-events.md)             |
| Error handling          | [references/structured-errors.md](references/structured-errors.md) |
| Code review checklist   | [references/code-review.md](references/code-review.md)             |

## Core Philosophy

### The Problem with Traditional Logging

```typescript
// ❌ Scattered logs - impossible to correlate during incidents
console.log('Request received')
console.log('User authenticated')
console.log('Loading cart')
console.log('Processing payment')
console.log('Payment failed')
```

### The Solution: Wide Events

```typescript
// server/api/checkout.post.ts
import { useLogger } from 'evlog'

// ✅ One comprehensive event per request
export default defineEventHandler(async (event) => {
  const log = useLogger(event)  // Auto-injected by evlog

  log.set({ user: { id: '123', plan: 'premium' } })
  log.set({ cart: { items: 3, total: 9999 } })
  log.error(error, { step: 'payment' })

  // emit() called automatically at request end
})
```

## Anti-Patterns to Detect

### 1. Console.log Spam

```typescript
// ❌ Multiple logs for one logical operation
console.log('Starting checkout')
console.log('User:', userId)
console.log('Cart:', cart)
console.log('Payment result:', result)
```

**Transform to:**

```typescript
// ✅ Single wide event
log.info({
  action: 'checkout',
  userId,
  cart,
  result,
  duration: '1.2s'
})
```

### 2. Generic Error Messages

```typescript
// ❌ Useless error
throw new Error('Something went wrong')

// ❌ Missing context
throw new Error('Payment failed')
```

**Transform to:**

```typescript
// ✅ Self-documenting error
throw defineError({
  message: 'Payment failed',
  why: 'Card declined by issuer',
  fix: 'Try a different payment method or contact your bank',
  link: 'https://docs.example.com/payments/declined',
  cause: originalError,
})
```

### 3. Missing Request Context

```typescript
// server/api/orders.post.ts

// ❌ No way to correlate logs
export default defineEventHandler(async (event) => {
  console.log('Processing request')
  const user = await getUser(event)
  console.log('Got user', user.id)
  // ...
})
```

**Transform to (Nuxt/Nitro):**

```typescript
// server/api/orders.post.ts
import { useLogger } from 'evlog'

// ✅ Request-scoped with full context
export default defineEventHandler(async (event) => {
  const log = useLogger(event)  // Auto-injected

  const user = await getUser(event)
  log.set({ user: { id: user.id, plan: user.plan } })

  // ... do work, accumulate context ...

  // emit() called automatically
})
```

**Transform to (Standalone TypeScript):**

```typescript
// scripts/process-job.ts
import { createRequestLogger } from 'evlog'

const log = createRequestLogger({ jobId: job.id, type: 'sync' })

log.set({ source: job.source, target: job.target })
// ... do work ...
log.emit()  // Manual emit for standalone usage
```

## Installation

```bash
npm install evlog
```

### Nuxt Integration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['evlog/nuxt'],
  evlog: {
    env: {
      service: 'my-app',
      environment: process.env.NODE_ENV,
    },
  },
})
```

### Nitro Integration

```typescript
// nitro.config.ts
export default defineNitroConfig({
  plugins: ['evlog/nitro'],
})
```

## Review Checklist

When reviewing code, check for:

1. **Console.log statements** → Replace with `useLogger(event).set()` or wide events
2. **Generic errors** → Add `why`, `fix`, and `link` fields with `defineError()`
3. **Scattered request logs** → Use `useLogger(event)` (Nuxt/Nitro) or `createRequestLogger()` (standalone)
4. **Missing context** → Add user, business, and outcome context with `log.set()`
5. **No duration tracking** → Let `emit()` handle it automatically

## Loading Reference Files

Load reference files based on what you're working on:

- Designing wide events → [references/wide-events.md](references/wide-events.md)
- Improving errors → [references/structured-errors.md](references/structured-errors.md)
- Full code review → [references/code-review.md](references/code-review.md)

**DO NOT load all files at once** - load only what's needed for the current task.
