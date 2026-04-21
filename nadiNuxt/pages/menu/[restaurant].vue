<script setup lang="ts">
const route = useRoute()
const slug = route.params.restaurant as string
const { get } = useApi()
const { activeRestaurant } = useCart()
const { imageFor } = useFoodImages()

const menuItems = ref<any[]>([])
const sections = ref<any[]>([])
const loading = ref(true)
const activeSection = ref('')

const restaurantMeta: Record<
  string,
  { name: string; image: string; tagline: string; location: string; description: string }
> = {
  mamnoon: {
    name: 'Mamnoon',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2940&auto=format&fit=crop',
    tagline: 'Eastern Mediterranean Kitchen',
    location: 'Seattle · Capitol Hill',
    description:
      'Vibrant flavors of Lebanon, Syria, Turkey, and beyond — rooted in familial tradition and modern technique.',
  },
  mamnoonstreet: {
    name: 'Mamnoon Street',
    image:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2940&auto=format&fit=crop',
    tagline: 'Fast-Casual Mediterranean',
    location: 'Seattle · Belltown',
    description:
      'Wraps, bowls, and street food favorites, made fresh daily from local ingredients and ancestral recipes.',
  },
  mbar: {
    name: 'Mbar',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop',
    tagline: 'Rooftop Dining & Cocktails',
    location: 'Seattle · South Lake Union',
    description:
      'Elevated Mediterranean cuisine paired with artisan cocktails, under panoramic city skies.',
  },
}

const meta = restaurantMeta[slug] || restaurantMeta.mamnoon
activeRestaurant.value = meta.name

function enrich(raw: any) {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || '',
    price: raw.price,
    imageUrl: imageFor(raw.name, raw.id),
    tags: raw.tags || [],
  }
}

onMounted(async () => {
  try {
    const res = await get<any>(`/product/upserve_mongo/${slug}`)
    if (res.doc?.[0]?.menu) {
      const menu = res.doc[0].menu
      menuItems.value = (menu.items || []).map(enrich)
      sections.value = menu.sections || []
      if (sections.value.length > 0) {
        activeSection.value = sections.value[0].name
      }
    }
  } catch (e) {
    console.error('Menu load failed:', e)
  }
  loading.value = false
})

const filteredItems = computed(() => {
  if (!activeSection.value || sections.value.length === 0) return menuItems.value
  const section = sections.value.find((s: any) => s.name === activeSection.value)
  if (!section) return menuItems.value
  return menuItems.value.filter((item: any) => section.item_ids.includes(item.id))
})

const sectionSubtitle = computed(() => {
  const section = sections.value.find((s: any) => s.name === activeSection.value)
  return section?.description || ''
})
</script>

<template>
  <div class="flex flex-col">
    <!-- Hero -->
    <section
      class="relative h-[50vh] min-h-[380px] sm:min-h-[480px] flex-shrink-0 w-full flex items-end pb-10 sm:pb-16 pt-24 sm:pt-28 px-6 sm:px-8 md:px-12"
    >
      <div class="absolute inset-0 w-full h-full z-0">
        <img
          :src="meta.image"
          :alt="meta.name"
          class="w-full h-full object-cover object-center opacity-70"
        />
        <div class="absolute inset-0 hero-gradient" />
      </div>
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-3 mb-4 sm:mb-6">
          <span class="w-6 sm:w-8 h-[1px] bg-terracotta-500" />
          <span
            class="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-terracotta-400 font-medium"
          >
            {{ meta.location }}
          </span>
        </div>
        <h1
          class="text-4xl sm:text-5xl lg:text-7xl font-light text-sand-100 mb-4 sm:mb-6 tracking-tight"
        >
          {{ meta.name }}
        </h1>
        <p
          class="text-base sm:text-lg lg:text-xl text-sand-300 font-light leading-relaxed max-w-2xl"
        >
          {{ meta.description }}
        </p>
      </div>
    </section>

    <!-- Category filter pills -->
    <div
      v-if="sections.length > 0"
      class="sticky top-[60px] sm:top-[72px] md:top-[88px] z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-850 px-6 sm:px-8 md:px-12 py-3 sm:py-4"
    >
      <div class="flex overflow-x-auto no-scrollbar gap-3 sm:gap-4 items-center -mx-1 px-1">
        <button
          v-for="section in sections"
          :key="section.name"
          class="whitespace-nowrap px-5 sm:px-6 py-2.5 min-h-[40px] rounded-full text-sm font-medium tracking-wide transition-all border flex-shrink-0"
          :class="
            activeSection === section.name
              ? 'bg-terracotta-500 text-white border-terracotta-500'
              : 'bg-transparent border-stone-800 text-sand-400 hover:text-sand-100 hover:border-stone-600'
          "
          @click="activeSection = section.name"
        >
          {{ section.name }}
        </button>
      </div>
    </div>

    <!-- Menu -->
    <section class="flex-1 px-6 sm:px-8 md:px-12 py-10 sm:py-16 max-w-5xl mx-auto w-full">
      <div
        v-if="activeSection"
        class="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-baseline sm:gap-4 border-b border-stone-850 pb-4 sm:pb-6"
      >
        <h2 class="text-2xl sm:text-3xl font-light text-sand-100">{{ activeSection }}</h2>
        <span
          v-if="sectionSubtitle"
          class="text-xs sm:text-sm text-sand-400 font-light mt-1 sm:mt-0"
        >
          {{ sectionSubtitle }}
        </span>
      </div>

      <div
        v-if="loading"
        class="py-20 flex flex-col items-center justify-center gap-4 text-stone-500"
      >
        <NadiLogo :size="28" class="text-stone-700 animate-pulse" />
        <p class="text-xs uppercase tracking-widest font-medium">
          Loading menu
        </p>
      </div>

      <div v-else-if="filteredItems.length > 0" class="flex flex-col">
        <MenuItem
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
        />
      </div>

      <div
        v-else
        class="py-20 flex flex-col items-center justify-center text-stone-500"
      >
        <p class="text-xs uppercase tracking-widest font-medium">
          No items in this section
        </p>
      </div>

      <div
        v-if="filteredItems.length > 0"
        class="py-20 flex flex-col items-center justify-center opacity-50"
      >
        <NadiLogo :size="24" class="text-stone-600 mb-4" />
        <p class="text-xs uppercase tracking-widest text-stone-500 font-medium">
          End of category
        </p>
      </div>
    </section>
  </div>
</template>
