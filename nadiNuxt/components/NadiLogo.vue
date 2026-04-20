<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
    /** Colour of the inner "nadi" letter cutouts — defaults to page background. */
    cutout?: string
  }>(),
  {
    size: 32,
    cutout: '#12100E',
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 91.22 91.22"
    xmlns="http://www.w3.org/2000/svg"
    class="shrink-0"
    aria-hidden="true"
  >
    <!-- Badge shape (8-point diamond) -->
    <polygon
      fill="currentColor"
      points="70.32 55.85 80.56 45.61 70.32 35.36 70.32 20.89 55.84 20.89 45.61 10.65 35.37 20.89 20.88 20.89 20.88 35.37 10.65 45.61 20.88 55.85 20.88 70.32 35.35 70.32 45.6 80.57 55.84 70.33 70.32 70.34 70.32 55.85"
    />
    <!-- "nadi" letterforms as cutouts -->
    <path
      :fill="cutout"
      d="M30.77,40.18l-.32.21-4.31-.82v23h3.32V48.75a7,7,0,0,1,3.84-6.21V39A10.54,10.54,0,0,0,30.77,40.18Z"
    />
    <path
      :fill="cutout"
      d="M53.65,38.48a10.26,10.26,0,0,0-7.91,3.73l-.72.87-.72-.87A10.05,10.05,0,0,0,39.65,39v3.59a7,7,0,0,1,3.77,6.18v13.9h3.33V48.75a6.95,6.95,0,1,1,13.9,0v13.9H64V48.75A10.27,10.27,0,0,0,53.7,38.48Z"
    />
    <path
      :fill="cutout"
      d="M52,43.54v6.71h3.36V43.51a5.46,5.46,0,0,0-3.36,0Z"
    />
    <path
      :fill="cutout"
      d="M55.33,37.13v-1.9A10.29,10.29,0,0,0,45.06,25a10.15,10.15,0,0,0-6,2l-.2.15-4.07-.78V50.22h3.36v-15a6.92,6.92,0,0,1,13.83,0v1.91a12.81,12.81,0,0,1,3.35,0Z"
    />
  </svg>
</template>
