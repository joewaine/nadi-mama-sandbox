<script setup lang="ts">
const props = defineProps<{
  item: {
    id: string
    name: string
    description?: string
    price: number
    imageUrl?: string
    tags?: string[]
  }
}>()

const { addItem } = useCart()
const added = ref(false)

function add() {
  addItem({ id: props.item.id, name: props.item.name, price: props.item.price })
  added.value = true
  setTimeout(() => (added.value = false), 900)
}
</script>

<template>
  <article
    class="group grid grid-cols-[80px_1fr_auto] sm:grid-cols-[112px_1fr_auto] gap-3 sm:gap-6 items-start py-6 sm:py-8 border-b border-stone-850/50 hover:border-stone-700 transition-colors cursor-pointer pr-2 sm:pr-4"
    @click="add"
  >
    <!-- Thumbnail -->
    <div
      class="relative w-20 h-20 sm:w-[112px] sm:h-[112px] overflow-hidden rounded-sm bg-stone-900 border border-stone-850 flex-shrink-0"
    >
      <img
        v-if="item.imageUrl"
        :src="item.imageUrl"
        :alt="item.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-stone-800"
      >
        <NadiLogo :size="32" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1.5 sm:gap-2 max-w-xl pt-0 sm:pt-1 min-w-0">
      <h3
        class="text-base sm:text-lg font-medium text-sand-100 group-hover:text-terracotta-400 transition-colors"
      >
        {{ item.name }}
      </h3>
      <p
        v-if="item.description"
        class="text-xs sm:text-sm text-sand-400 leading-relaxed font-light line-clamp-2"
      >
        {{ item.description }}
      </p>
      <div v-if="item.tags?.length" class="flex gap-2 mt-2 flex-wrap">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 border border-stone-800 text-stone-500 rounded-sm"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Price + Add -->
    <div class="flex flex-col items-end gap-2 sm:gap-4 pt-0 sm:pt-1">
      <span class="text-base sm:text-lg font-light text-sand-200 tracking-wide">
        ${{ (item.price / 100).toFixed(2) }}
      </span>
      <button
        class="w-11 h-11 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300"
        :class="
          added
            ? 'bg-terracotta-500 text-white border-terracotta-500 scale-110'
            : 'border-stone-800 text-sand-400 group-hover:bg-sand-100 group-hover:text-stone-900 group-hover:border-sand-100 group-hover:scale-105'
        "
        :aria-label="`Add ${item.name} to order`"
        @click.stop="add"
      >
        <svg
          v-if="!added"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  </article>
</template>
