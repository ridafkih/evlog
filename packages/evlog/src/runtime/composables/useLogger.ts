import type { H3Event } from 'h3'
import type { RequestLogger } from '../../types'

/**
 * Get the request-scoped logger from the event context.
 * Must be called within a server handler with an H3 event.
 *
 * @example
 * ```ts
 * export default defineEventHandler((event) => {
 *   const logger = useLogger(event)
 *   logger.set({ userId: '123' })
 *   logger.set({ action: 'checkout' })
 *   return { ok: true }
 *   // emit() is called automatically by the Nitro plugin
 * })
 * ```
 */
export function useLogger(event: H3Event): RequestLogger {
  const log = event.context.log as RequestLogger | undefined

  if (!log) {
    throw new Error(
      '[evlog] Logger not initialized. Make sure the evlog Nitro plugin is registered. '
      + 'If using Nuxt, add "evlog" to your modules.',
    )
  }

  return log
}
