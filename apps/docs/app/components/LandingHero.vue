<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
    <div class="hero-grid absolute inset-0 opacity-50" />

    <CornerBrackets />

    <div class="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
      >
        <p class="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
          Wide Events & Structured Errors
        </p>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
      >
        <h1 class="editorial-title mb-8 text-5xl font-bold text-highlighted md:text-7xl">
          Logging that<br>
          <span class="inline-flex items-baseline gap-2">
            makes sense
            <BlueDot size="lg" />
          </span>
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }"
      >
        <p class="mx-auto mb-12 max-w-2xl text-lg text-muted md:text-xl">
          A TypeScript logging library that replaces scattered log lines with comprehensive wide events.
          One log per request, containing everything you need.
        </p>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3 }"
        class="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <UButton
          to="/getting-started/introduction"
          size="xl"
          color="neutral"
          trailing-icon="i-lucide-arrow-right"
        >
          Get Started
        </UButton>
        <UButton
          to="https://github.com/hugorcd/evlog"
          target="_blank"
          size="xl"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-github"
        >
          Star on GitHub
        </UButton>
      </Motion>
    </div>
  </section>
</template>
