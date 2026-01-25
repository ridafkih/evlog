import { initLog } from './log'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const evlogConfig = config.public?.evlog as { pretty?: boolean } | undefined

  initLog({
    pretty: evlogConfig?.pretty ?? import.meta.dev,
    service: 'client',
  })
})
