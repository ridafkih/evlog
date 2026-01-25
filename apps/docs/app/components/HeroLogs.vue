<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface LogItem {
  id: number
  text: string
  type: 'info' | 'debug' | 'warn' | 'error'
  x: number
  y: number
  opacity: number
}

const logs = ref<LogItem[]>([])
let interval: ReturnType<typeof setInterval>
let logId = 0

const logMessages = [
  { text: '[INFO] Request started', type: 'info' as const },
  { text: '[INFO] GET /api/users', type: 'info' as const },
  { text: '[INFO] POST /api/orders', type: 'info' as const },
  { text: '[INFO] PUT /api/products/42', type: 'info' as const },
  { text: '[INFO] User authenticated', type: 'info' as const },
  { text: '[INFO] Session created', type: 'info' as const },
  { text: '[INFO] Token refreshed', type: 'info' as const },
  { text: '[INFO] Cart loaded: 3 items', type: 'info' as const },
  { text: '[INFO] Payment successful', type: 'info' as const },
  { text: '[INFO] Order created: #12847', type: 'info' as const },
  { text: '[INFO] Email sent to user', type: 'info' as const },
  { text: '[INFO] Webhook delivered', type: 'info' as const },
  { text: '[INFO] Cache invalidated', type: 'info' as const },
  { text: '[INFO] File uploaded: 2.4MB', type: 'info' as const },
  { text: '[DEBUG] Fetching user...', type: 'debug' as const },
  { text: '[DEBUG] Loading cart...', type: 'debug' as const },
  { text: '[DEBUG] Validating payment...', type: 'debug' as const },
  { text: '[DEBUG] Updating inventory...', type: 'debug' as const },
  { text: '[DEBUG] Sending confirmation...', type: 'debug' as const },
  { text: '[DEBUG] Checking permissions', type: 'debug' as const },
  { text: '[DEBUG] Query took 23ms', type: 'debug' as const },
  { text: '[DEBUG] Redis cache hit', type: 'debug' as const },
  { text: '[DEBUG] Parsing request body', type: 'debug' as const },
  { text: '[WARN] Rate limit approaching', type: 'warn' as const },
  { text: '[WARN] Slow query: 450ms', type: 'warn' as const },
  { text: '[WARN] Deprecated API used', type: 'warn' as const },
  { text: '[WARN] Memory usage high', type: 'warn' as const },
  { text: '[WARN] Retry attempt 2/3', type: 'warn' as const },
  { text: '[ERROR] Card declined', type: 'error' as const },
  { text: '[ERROR] Connection timeout', type: 'error' as const },
  { text: '[ERROR] Invalid token', type: 'error' as const },
  { text: '[ERROR] Rate limit exceeded', type: 'error' as const },
  { text: '[ERROR] Database unreachable', type: 'error' as const },
  { text: 'user: { id: 1, plan: "pro" }', type: 'debug' as const },
  { text: 'cart: { items: 3, total: 9999 }', type: 'debug' as const },
  { text: 'status: 200 (234ms)', type: 'info' as const },
  { text: 'traceId: "abc-123-xyz"', type: 'debug' as const },
]

function createLog() {
  const msg = logMessages[Math.floor(Math.random() * logMessages.length)]
  const isLeft = Math.random() > 0.5

  const log: LogItem = {
    id: logId++,
    text: msg.text,
    type: msg.type,
    x: isLeft ? 1 + Math.random() * 18 : 81 + Math.random() * 18,
    y: 5 + Math.random() * 90,
    opacity: 0,
  }

  logs.value.push(log)

  setTimeout(() => {
    const idx = logs.value.findIndex(l => l.id === log.id)
    if (idx !== -1) {
      logs.value[idx].opacity = 0.5 + Math.random() * 0.3
    }
  }, 50)

  setTimeout(() => {
    const idx = logs.value.findIndex(l => l.id === log.id)
    if (idx !== -1) {
      logs.value[idx].opacity = 0
    }
  }, 4000 + Math.random() * 3000)

  setTimeout(() => {
    logs.value = logs.value.filter(l => l.id !== log.id)
  }, 8000)
}

onMounted(() => {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => createLog(), i * 150)
  }

  interval = setInterval(() => {
    if (logs.value.length < 25) {
      createLog()
    }
  }, 400)
})

onUnmounted(() => {
  clearInterval(interval)
})

function getTypeColor(type: LogItem['type']) {
  switch (type) {
    case 'info': return 'text-emerald-600 dark:text-emerald-400'
    case 'debug': return 'text-zinc-400 dark:text-zinc-600'
    case 'warn': return 'text-amber-600 dark:text-amber-400'
    case 'error': return 'text-red-600 dark:text-red-400'
  }
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    <TransitionGroup name="log">
      <div
        v-for="log in logs"
        :key="log.id"
        class="absolute whitespace-nowrap font-mono text-[11px] transition-opacity duration-1000 md:text-xs"
        :class="getTypeColor(log.type)"
        :style="{
          left: `${log.x}%`,
          top: `${log.y}%`,
          opacity: log.opacity,
        }"
      >
        {{ log.text }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.log-enter-active,
.log-leave-active {
  transition: opacity 1s ease;
}

.log-enter-from,
.log-leave-to {
  opacity: 0;
}
</style>
