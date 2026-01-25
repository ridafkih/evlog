import type { RequestLogger, ServerEvent } from '../../types'

export function useLogger(event: ServerEvent): RequestLogger {
  const log = event.context.log as RequestLogger | undefined

  if (!log) {
    throw new Error(
      '[evlog] Logger not initialized. Make sure the evlog Nitro plugin is registered. '
      + 'If using Nuxt, add "evlog" to your modules.',
    )
  }

  return log
}
