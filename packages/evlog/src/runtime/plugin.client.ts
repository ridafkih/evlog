import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initLog } from './composables/log'

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig()
  const evlogConfig = config.public?.evlog as { pretty?: boolean } | undefined

  // Initialize log settings for client
  initLog({
    pretty: evlogConfig?.pretty ?? import.meta.dev,
    service: 'client',
  })
})
