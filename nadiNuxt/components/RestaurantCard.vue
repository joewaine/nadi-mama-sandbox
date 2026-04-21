<script setup lang="ts">
defineProps<{
  name: string
  description: string
  image: string
  address: string
  hours: string
  slug: string
  tagline?: string
}>()
</script>

<template>
  <NuxtLink
    :to="`/menu/${slug}`"
    class="group relative block overflow-hidden bg-stone-900 border border-stone-850 hover:border-stone-700 transition-all duration-500"
  >
    <!-- Image -->
    <div class="relative h-[320px] sm:h-[380px] md:h-[420px] overflow-hidden">
      <img
        :src="image"
        :alt="name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-95"
      />
      <div class="absolute inset-0 hero-gradient" />

      <!-- Top tag -->
      <div class="absolute top-6 left-6 inline-flex items-center gap-3">
        <span class="w-6 h-[1px] bg-terracotta-500" />
        <span
          class="text-[0.65rem] tracking-[0.25em] uppercase text-terracotta-400 font-medium"
        >
          {{ tagline || 'Seattle, WA' }}
        </span>
      </div>

      <!-- Bottom content -->
      <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
        <h3
          class="text-2xl sm:text-3xl font-light text-sand-100 mb-2 sm:mb-3 tracking-tight"
        >
          {{ name }}
        </h3>
        <p class="text-xs sm:text-sm text-sand-300 font-light leading-relaxed max-w-md">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="px-5 sm:px-8 py-5 sm:py-6 border-t border-stone-850 flex items-center justify-between gap-4"
    >
      <div class="flex flex-col gap-1">
        <span
          class="text-[0.65rem] uppercase tracking-widest text-stone-500 font-medium"
        >
          {{ address }}
        </span>
        <span class="text-xs text-sand-400 font-light">{{ hours }}</span>
      </div>
      <span
        class="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase font-medium text-sand-100 group-hover:text-terracotta-400 transition-colors"
      >
        Explore Menu
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-transform duration-300 group-hover:translate-x-1"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>
