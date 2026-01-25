<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <section class="relative py-32">
    <div class="editorial-separator mx-auto mb-24 max-w-md" />

    <div class="mx-auto max-w-4xl px-6 text-center">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :in-view-options="{ once: true }"
      >
        <h2 class="editorial-title mb-6 text-3xl font-bold text-highlighted md:text-5xl">
          Ready to fix your logging<span class="evlog-dot">?</span>
        </h2>
        <p class="mx-auto mb-10 max-w-xl text-lg text-muted">
          Inspired by <a href="https://loggingsucks.com/" target="_blank" class="underline underline-offset-4 hover:text-highlighted">Logging Sucks</a> by Boris Tane.
          One log per request. Everything you need.
        </p>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }"
        :in-view-options="{ once: true }"
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
