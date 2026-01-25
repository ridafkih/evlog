<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <span
    class="inline-block rounded-full bg-evlog-blue"
    :class="{
      'size-1.5': size === 'sm',
      'size-2': size === 'md' || !size,
      'size-3': size === 'lg',
    }"
  />
</template>
