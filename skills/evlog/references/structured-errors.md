# Structured Errors Guide

Structured errors provide context that helps developers understand **what** happened, **why** it happened, and **how to fix it**.

## The Problem with Generic Errors

```typescript
// ❌ Useless errors
throw new Error('Something went wrong')
throw new Error('Failed')
throw new Error('Invalid input')

// ❌ Missing context
throw new Error('Payment failed')  // Why? How do I fix it?
```

When these errors reach your logs or monitoring, you have no idea:

- What actually failed
- Why it failed
- How to fix it
- Where to find more information

## Structured Error Anatomy

```typescript
import { defineError } from 'evlog'

throw defineError({
  message: 'Payment failed',              // What happened
  why: 'Card declined by issuer',         // Why it happened
  fix: 'Try a different payment method',  // How to fix it
  link: 'https://docs.example.com/...',   // More information
  cause: originalError,                   // Original error
})
```

### Console Output (Development)

```
Error: Payment failed
Why: Card declined by issuer
Fix: Try a different payment method
More info: https://docs.example.com/payments/declined

Caused by: StripeCardError: card_declined
```

### JSON Output (Production)

```json
{
  "name": "EvlogError",
  "message": "Payment failed",
  "why": "Card declined by issuer",
  "fix": "Try a different payment method",
  "link": "https://docs.example.com/payments/declined",
  "cause": {
    "name": "StripeCardError",
    "message": "card_declined"
  },
  "stack": "..."
}
```

## Field Guidelines

### `message` - What Happened

User-facing description of what went wrong.

```typescript
// ✅ Good - clear, actionable
message: 'Failed to sync repository'
message: 'Unable to process payment'
message: 'User not found'

// ❌ Bad - vague, unhelpful
message: 'Error'
message: 'Something went wrong'
message: 'Failed'
```

### `why` - Why It Happened

Technical explanation for debugging.

```typescript
// ✅ Good - specific, technical
why: 'GitHub API rate limit exceeded (403)'
why: 'Card declined by issuer: insufficient_funds'
why: 'No user with ID "user_123" exists in database'

// ❌ Bad - just restating the message
why: 'It failed'
why: 'Error occurred'
```

### `fix` - How to Fix It

Actionable steps to resolve the issue.

```typescript
// ✅ Good - specific actions
fix: 'Wait 1 hour or use a different API token'
fix: 'Use a different payment method or contact your bank'
fix: 'Check the user ID and try again'

// ❌ Bad - not actionable
fix: 'Fix the error'
fix: 'Try again'
```

### `link` - More Information

Documentation URL for detailed troubleshooting.

```typescript
// ✅ Good - specific documentation
link: 'https://docs.github.com/en/rest/rate-limit'
link: 'https://docs.stripe.com/declines/codes'
link: 'https://your-app.com/docs/errors/user-not-found'
```

### `cause` - Original Error

The underlying error that triggered this one.

```typescript
try {
  await stripe.charges.create(...)
} catch (error) {
  throw defineError({
    message: 'Payment failed',
    why: `Stripe error: ${error.code}`,
    fix: 'Contact support with error code',
    cause: error,  // Preserves original stack trace
  })
}
```

## Common Error Patterns

### API/External Service Errors

```typescript
// Rate limiting
throw defineError({
  message: 'GitHub sync temporarily unavailable',
  why: 'API rate limit exceeded (5000/hour)',
  fix: 'Wait until rate limit resets or use authenticated requests',
  link: 'https://docs.github.com/en/rest/rate-limit',
  cause: error,
})

// Authentication
throw defineError({
  message: 'Unable to connect to Stripe',
  why: 'Invalid API key provided',
  fix: 'Check STRIPE_SECRET_KEY environment variable',
  link: 'https://docs.stripe.com/keys',
  cause: error,
})

// Network
throw defineError({
  message: 'Failed to fetch user data',
  why: 'Connection timeout after 30s',
  fix: 'Check network connectivity and try again',
  cause: error,
})
```

### Validation Errors

```typescript
// Missing required field
throw defineError({
  message: 'Invalid checkout request',
  why: 'Required field "email" is missing',
  fix: 'Include a valid email address in the request body',
  link: 'https://your-api.com/docs/checkout#request-body',
})

// Invalid format
throw defineError({
  message: 'Invalid email format',
  why: `"${email}" is not a valid email address`,
  fix: 'Provide an email in the format user@example.com',
})

// Business rule violation
throw defineError({
  message: 'Cannot cancel subscription',
  why: 'Subscription has already been cancelled',
  fix: 'No action needed - subscription is already inactive',
})
```

### Database Errors

```typescript
// Not found
throw defineError({
  message: 'User not found',
  why: `No user with ID "${userId}" exists`,
  fix: 'Verify the user ID is correct',
})

// Constraint violation
throw defineError({
  message: 'Cannot create duplicate account',
  why: `User with email "${email}" already exists`,
  fix: 'Use a different email or log in to existing account',
  link: 'https://your-app.com/login',
})

// Connection
throw defineError({
  message: 'Database unavailable',
  why: 'Connection pool exhausted',
  fix: 'Reduce concurrent connections or increase pool size',
  cause: error,
})
```

### Permission Errors

```typescript
throw defineError({
  message: 'Access denied',
  why: 'User lacks "admin" role required for this action',
  fix: 'Contact an administrator to request access',
  link: 'https://your-app.com/docs/permissions',
})
```

## Transformation Examples

### Before: Generic Error

```typescript
async function processPayment(cart, user) {
  try {
    return await stripe.charges.create({
      amount: cart.total,
      currency: 'usd',
      source: user.paymentMethodId,
    })
  } catch (error) {
    throw new Error('Payment failed')  // ❌ No context
  }
}
```

### After: Structured Error

```typescript
async function processPayment(cart, user) {
  try {
    return await stripe.charges.create({
      amount: cart.total,
      currency: 'usd',
      source: user.paymentMethodId,
    })
  } catch (error) {
    throw defineError({
      message: 'Payment failed',
      why: getStripeErrorReason(error),
      fix: getStripeErrorFix(error),
      link: 'https://docs.stripe.com/declines/codes',
      cause: error,
    })
  }
}

function getStripeErrorReason(error) {
  const reasons = {
    card_declined: 'Card was declined by the issuer',
    insufficient_funds: 'Card has insufficient funds',
    expired_card: 'Card has expired',
    // ...
  }
  return reasons[error.code] ?? `Stripe error: ${error.code}`
}

function getStripeErrorFix(error) {
  const fixes = {
    card_declined: 'Try a different payment method or contact your bank',
    insufficient_funds: 'Use a different card or add funds',
    expired_card: 'Update your card details with a valid expiration date',
    // ...
  }
  return fixes[error.code] ?? 'Contact support with error code'
}
```

## Integration with Wide Events

Structured errors integrate seamlessly with wide events:

```typescript
// server/api/checkout.post.ts
import { useLogger, defineError } from 'evlog'

export default defineEventHandler(async (event) => {
  const log = useLogger(event)

  try {
    // ... business logic ...
  } catch (error) {
    // EvlogError fields are automatically captured
    log.error(error, { step: 'payment' })
    throw defineError({
      message: 'Payment failed',
      why: error.message,
      fix: 'Try a different payment method',
    })
  }
  // emit() called automatically
})
```

The wide event will include:

```json
{
  "error": {
    "name": "EvlogError",
    "message": "Payment failed",
    "why": "Card declined by issuer",
    "fix": "Try a different payment method",
    "link": "https://docs.stripe.com/declines/codes"
  },
  "step": "payment"
}
```

## Best Practices

### Do

- Always provide `message` and `why` at minimum
- Include `fix` when there's an actionable solution
- Add `link` to documentation for complex errors
- Preserve `cause` when wrapping errors
- Be specific about what failed and why

### Don't

- Use generic messages like "Error" or "Failed"
- Leak sensitive data (passwords, tokens, PII)
- Make `why` and `message` identical
- Suggest fixes that aren't actually possible
- Create errors without any context

## Error Message Templates

Use these as starting points:

```typescript
// Resource not found
defineError({
  message: '${Resource} not found',
  why: 'No ${resource} with ${identifier} "${value}" exists',
  fix: 'Verify the ${identifier} is correct',
})

// External service failure
defineError({
  message: 'Unable to ${action}',
  why: '${Service} returned error: ${code}',
  fix: '${actionable_step}',
  link: '${service_docs_url}',
  cause: error,
})

// Validation failure
defineError({
  message: 'Invalid ${field}',
  why: '"${value}" ${reason}',
  fix: '${expected_format}',
})

// Permission denied
defineError({
  message: 'Access denied',
  why: '${reason} required for this action',
  fix: '${how_to_get_access}',
})
```
