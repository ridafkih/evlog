import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // Main entry
    { input: 'src/index', name: 'index' },
    // Nuxt module
    { input: 'src/nuxt/module', name: 'nuxt/module' },
    // Nitro plugin
    { input: 'src/nitro/plugin', name: 'nitro/plugin' },
    // Runtime composables (for Nuxt auto-imports)
    { input: 'src/runtime/composables/index', name: 'runtime/composables/index' },
    { input: 'src/runtime/composables/useLogger', name: 'runtime/composables/useLogger' },
    { input: 'src/runtime/composables/log', name: 'runtime/composables/log' },
    // Client plugin
    { input: 'src/runtime/plugin.client', name: 'runtime/plugin.client' },
    // Individual modules for tree-shaking
    { input: 'src/error', name: 'error' },
    { input: 'src/logger', name: 'logger' },
    { input: 'src/client', name: 'client' },
    { input: 'src/utils', name: 'utils' },
    { input: 'src/types', name: 'types' },
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: false,
    esbuild: {
      target: 'esnext',
    },
  },
  externals: [
    '#app',
    '#imports',
    'vue',
    'nuxt',
    '@nuxt/kit',
    '@nuxt/schema',
    'nitropack',
    'nitropack/runtime',
    'h3',
    'pkg-types',
  ],
})
