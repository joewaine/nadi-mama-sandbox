<script setup lang="ts">
const restaurants = [
  {
    name: 'Mamnoon',
    slug: 'mamnoon',
    tagline: 'Seattle · Capitol Hill',
    description:
      'Eastern Mediterranean Kitchen — vibrant flavors of Lebanon, Syria, Turkey, and beyond, rooted in familial tradition and modern technique.',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80&auto=format&fit=crop',
    address: '1508 Melrose Ave',
    hours: 'Tue–Sun · 5–10pm',
  },
  {
    name: 'Mamnoon Street',
    slug: 'mamnoonstreet',
    tagline: 'Seattle · Belltown',
    description:
      'A fast-casual expression of the Levantine canon — wraps, bowls, and market-fresh street food, crafted daily.',
    image:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80&auto=format&fit=crop',
    address: '2020 6th Ave',
    hours: 'Mon–Sat · 11am–9pm',
  },
  {
    name: 'Mbar',
    slug: 'mbar',
    tagline: 'Seattle · South Lake Union',
    description:
      'Rooftop dining and cocktails — elevated Mediterranean plates under panoramic skies and warm lanterns.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
    address: '400 Fairview Ave N',
    hours: 'Wed–Sun · 5–11pm',
  },
]

const chapters = [
  {
    number: '01',
    title: 'Browse & Compose',
    desc: 'Live menus synced from the kitchen. Build your feast with modifiers, spice levels, and accompaniments.',
  },
  {
    number: '02',
    title: 'Pay with Ease',
    desc: 'Tokenized, encrypted payment. Save cards, redeem gift certificates, add a tip for the team.',
  },
  {
    number: '03',
    title: 'Track & Savor',
    desc: 'Real-time updates from prep to pickup. Email and SMS notifications keep you informed at every step.',
  },
]
</script>

<template>
  <div class="flex flex-col">
    <!-- Hero -->
    <section
      class="relative min-h-[640px] h-[92vh] flex items-end pb-16 sm:pb-20 pt-24 sm:pt-28 px-6 sm:px-8 md:px-16 overflow-hidden"
    >
      <div class="absolute inset-0 w-full h-full z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-c6a4d14b9a52?q=80&w=2940&auto=format&fit=crop"
          alt="Eastern Mediterranean spread"
          class="w-full h-full object-cover object-center opacity-70"
        />
        <div class="absolute inset-0 hero-gradient" />
      </div>

      <div class="relative z-10 max-w-4xl">
        <div class="inline-flex items-center gap-3 mb-8">
          <span class="w-8 h-[1px] bg-terracotta-500" />
          <span
            class="text-xs tracking-[0.25em] uppercase text-terracotta-400 font-medium"
          >
            Three Restaurants · One Family
          </span>
        </div>
        <h1
          class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-sand-100 mb-6 sm:mb-8 tracking-tight leading-[0.95]"
        >
          Taste the soul
          <br />
          of the Levant.
        </h1>
        <p
          class="text-base sm:text-lg lg:text-xl text-sand-300 font-light leading-relaxed max-w-2xl mb-8 sm:mb-10"
        >
          Eastern Mediterranean cuisine, served from kitchens rooted in the
          warmth of family, spice, and story. Order online for pickup or
          delivery across Seattle.
        </p>
        <div class="flex flex-wrap items-center gap-3 sm:gap-4">
          <NuxtLink
            to="/menu/mamnoon"
            class="bg-terracotta-500 hover:bg-terracotta-400 text-white px-6 sm:px-8 py-4 min-h-[48px] rounded text-xs font-medium tracking-[0.15em] uppercase transition-colors inline-flex items-center gap-3"
          >
            Start an Order
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </NuxtLink>
          <a
            href="#restaurants"
            class="px-6 sm:px-8 py-4 min-h-[48px] border border-stone-700 hover:border-sand-400 text-sand-200 hover:text-sand-100 rounded text-xs font-medium tracking-[0.15em] uppercase transition-colors inline-flex items-center"
          >
            Explore Restaurants
          </a>
        </div>
      </div>

      <!-- Sandbox chip -->
      <div
        class="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:right-16 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-800 bg-stone-950/60 backdrop-blur-sm text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-stone-400"
      >
        <span class="w-1.5 h-1.5 bg-terracotta-400 rounded-full animate-pulse" />
        Sandbox Mode
      </div>
    </section>

    <!-- Restaurants -->
    <section
      id="restaurants"
      class="py-16 sm:py-24 md:py-28 px-6 sm:px-8 md:px-16 bg-stone-950"
    >
      <div class="max-w-7xl mx-auto">
        <div class="mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 sm:pb-8 border-b border-stone-850">
          <div>
            <span
              class="text-[0.65rem] tracking-[0.25em] uppercase text-terracotta-400 font-medium"
            >
              The Table
            </span>
            <h2
              class="text-3xl sm:text-4xl md:text-5xl font-light text-sand-100 tracking-tight mt-3"
            >
              Our Restaurants
            </h2>
          </div>
          <p class="text-sand-400 font-light max-w-md leading-relaxed">
            Three distinct dining experiences, united by a shared passion for
            the breadth and depth of Eastern Mediterranean cuisine.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RestaurantCard
            v-for="r in restaurants"
            :key="r.slug"
            v-bind="r"
          />
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-16 sm:py-24 md:py-28 px-6 sm:px-8 md:px-16 bg-[#0A0908] border-t border-stone-900">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14 sm:mb-20">
          <span
            class="text-[0.65rem] tracking-[0.25em] uppercase text-terracotta-400 font-medium"
          >
            The Journey
          </span>
          <h2
            class="text-3xl sm:text-4xl md:text-5xl font-light text-sand-100 tracking-tight mt-3"
          >
            From our kitchen to yours
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-10 sm:gap-12 md:gap-16">
          <div
            v-for="chapter in chapters"
            :key="chapter.number"
            class="flex flex-col gap-6"
          >
            <div class="flex items-baseline gap-4">
              <span
                class="text-5xl font-light text-terracotta-500 tracking-tight"
              >
                {{ chapter.number }}
              </span>
              <div class="flex-1 h-[1px] bg-stone-850" />
            </div>
            <h3
              class="text-xl font-light text-sand-100 tracking-tight"
            >
              {{ chapter.title }}
            </h3>
            <p class="text-sm text-sand-400 leading-relaxed font-light">
              {{ chapter.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="mt-auto py-12 sm:py-16 px-6 sm:px-8 md:px-16 border-t border-stone-900 bg-stone-950"
    >
      <div
        class="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 sm:gap-12 pb-10 sm:pb-12 border-b border-stone-900"
      >
        <div>
          <div class="flex items-center gap-3 mb-4">
            <NadiLogo :size="28" class="text-sand-200" />
            <span
              class="text-sm tracking-[0.2em] font-medium uppercase text-sand-100 mt-1"
            >
              Nadi Mama
            </span>
          </div>
          <p class="text-sand-400 text-sm leading-relaxed font-light max-w-xs">
            Eastern Mediterranean cuisine. Three restaurants, one family.
          </p>
        </div>
        <div>
          <h4
            class="text-[0.65rem] font-semibold tracking-[0.25em] uppercase mb-5 text-stone-500"
          >
            Restaurants
          </h4>
          <div class="space-y-3">
            <NuxtLink
              v-for="r in restaurants"
              :key="r.slug"
              :to="`/menu/${r.slug}`"
              class="block text-sm text-sand-400 hover:text-sand-100 transition-colors"
            >
              {{ r.name }}
            </NuxtLink>
          </div>
        </div>
        <div>
          <h4
            class="text-[0.65rem] font-semibold tracking-[0.25em] uppercase mb-5 text-stone-500"
          >
            Portfolio Demo
          </h4>
          <p class="text-stone-500 text-xs leading-relaxed font-light">
            A sandboxed demo. Payments, emails, and SMS are mocked. Built with
            Nuxt 3, Vue 3, Tailwind, Node.js, Express, MongoDB.
          </p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto pt-8 flex flex-col items-center gap-4">
        <NadiLogo :size="20" class="text-stone-800" />
        <p
          class="text-[0.65rem] uppercase tracking-[0.4em] text-stone-600"
        >
          © 2026 Nadi Mama Hospitality Group
        </p>
      </div>
    </footer>
  </div>
</template>
