<script setup lang="ts">
const { loggedIn, user, logout } = useAuth()
const { get } = useApi()
const { imageFor } = useFoodImages()

const orders = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!loggedIn.value) return
  try {
    const res = await get<any>(`/order/email/${user.value?.email}`)
    orders.value = (res.user || []).sort(
      (a: any, b: any) =>
        (b.orderInfo?.timeStamp || 0) - (a.orderInfo?.timeStamp || 0),
    )
  } catch (e) {
    console.error('Failed to load orders:', e)
  }
  loading.value = false
})

function formatDate(ts?: number) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function itemSummary(order: any): string {
  const items = order.orderInfo?.charges?.items || []
  if (items.length === 0) return 'No items'
  return items
    .slice(0, 4)
    .map((i: any) =>
      i.quantity > 1 ? `${i.name} (${i.quantity})` : i.name,
    )
    .join(', ')
    .concat(items.length > 4 ? ', …' : '')
}

const favoriteDishes = computed(() => {
  const seen = new Map<string, { name: string; restaurant: string }>()
  for (const order of orders.value) {
    const restaurant = order.orderInfo?.restaurant || 'Mamnoon'
    for (const item of order.orderInfo?.charges?.items || []) {
      if (!seen.has(item.name)) {
        seen.set(item.name, { name: item.name, restaurant })
      }
    }
    if (seen.size >= 4) break
  }
  return Array.from(seen.values())
})
</script>

<template>
  <div class="flex-1 px-8 lg:px-24 pt-32 pb-16 max-w-7xl mx-auto w-full">
    <div v-if="!loggedIn" class="py-32 text-center">
      <h1 class="text-3xl font-light text-sand-100 mb-4 tracking-tight">
        Sign in to view your account
      </h1>
      <p class="text-sand-400 font-light mb-8">
        Order history, saved addresses, and favorites live here.
      </p>
      <NuxtLink
        to="/"
        class="inline-block bg-terracotta-500 hover:bg-terracotta-400 text-white px-8 py-3 rounded text-xs font-medium tracking-[0.15em] uppercase transition-colors"
      >
        Return Home
      </NuxtLink>
    </div>

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-12 gap-12"
    >
      <!-- Sidebar -->
      <aside class="lg:col-span-3 space-y-8">
        <div>
          <h1 class="text-2xl font-light text-sand-100 mb-1 tracking-tight">
            Account
          </h1>
          <p
            class="text-[0.65rem] tracking-[0.25em] uppercase text-stone-500 font-semibold"
          >
            {{ user?.name || 'Guest' }}
          </p>
        </div>
        <nav class="flex flex-col gap-2">
          <a
            href="#orders"
            class="px-4 py-2 bg-stone-900 border border-stone-800 rounded-sm text-sm text-sand-100 font-medium"
          >
            Order History
          </a>
          <a
            href="#favorites"
            class="px-4 py-2 hover:bg-stone-900/50 rounded-sm text-sm text-sand-400 hover:text-sand-200 transition-colors"
          >
            Favorite Dishes
          </a>
          <a
            href="#addresses"
            class="px-4 py-2 hover:bg-stone-900/50 rounded-sm text-sm text-sand-400 hover:text-sand-200 transition-colors"
          >
            Saved Addresses
          </a>
          <a
            href="#"
            class="px-4 py-2 hover:bg-stone-900/50 rounded-sm text-sm text-sand-400 hover:text-sand-200 transition-colors"
            @click.prevent
          >
            Payment Methods
          </a>
          <div class="h-px bg-stone-850 my-2" />
          <button
            class="px-4 py-2 text-sm text-stone-500 hover:text-terracotta-400 transition-colors text-left"
            @click="logout"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      <!-- Content -->
      <section class="lg:col-span-9 space-y-16">
        <!-- Orders -->
        <div id="orders">
          <div
            class="flex items-baseline justify-between border-b border-stone-850 pb-4 mb-8"
          >
            <h2 class="text-xl font-light text-sand-100 tracking-tight">
              Order History
            </h2>
            <span class="text-xs text-stone-500">Last 12 months</span>
          </div>

          <div
            v-if="loading"
            class="py-16 flex flex-col items-center justify-center gap-3 text-stone-500"
          >
            <NadiLogo :size="24" class="text-stone-700 animate-pulse" />
            <p class="text-xs uppercase tracking-widest">Loading orders</p>
          </div>

          <div v-else-if="orders.length === 0" class="py-16 text-center">
            <p class="text-sand-400 mb-4 font-light">No orders yet.</p>
            <NuxtLink
              to="/"
              class="text-[0.65rem] uppercase tracking-[0.25em] text-terracotta-400 hover:text-terracotta-300 transition-colors font-semibold"
            >
              Start ordering
            </NuxtLink>
          </div>

          <div v-else class="space-y-4">
            <article
              v-for="order in orders"
              :key="order._id"
              class="group bg-stone-900/30 border border-stone-850 hover:border-stone-700 p-6 rounded-sm transition-all"
            >
              <div
                class="flex flex-wrap justify-between items-start gap-4 mb-4"
              >
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="text-sm font-semibold text-sand-100 uppercase tracking-wider">
                      {{ order.orderInfo?.restaurant }}
                    </h3>
                    <span
                      class="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                      :class="
                        order.status === 'Closed'
                          ? 'bg-terracotta-500/10 text-terracotta-400 border-terracotta-500/30'
                          : 'bg-stone-850 text-stone-400 border-stone-800'
                      "
                    >
                      {{ order.status || 'In Progress' }}
                    </span>
                  </div>
                  <p class="text-xs text-sand-400 font-light">
                    {{ formatDate(order.orderInfo?.timeStamp) }} · Order #{{
                      order.orderInfo?.confirmation_code?.slice(-6) || '—'
                    }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-sand-100">
                    ${{ ((order.orderInfo?.charges?.total || 0) / 100).toFixed(2) }}
                  </p>
                  <button
                    class="text-[10px] uppercase tracking-widest text-terracotta-400 hover:text-terracotta-500 mt-1 font-semibold"
                  >
                    Reorder items
                  </button>
                </div>
              </div>
              <p class="text-xs text-sand-400 italic font-light leading-relaxed">
                {{ itemSummary(order) }}
              </p>

              <div
                v-if="order.shippingInfo?.tracking_number"
                class="mt-3 text-[0.65rem] uppercase tracking-widest text-stone-500 font-medium"
              >
                Tracking · {{ order.shippingInfo.tracking_number }}
              </div>
            </article>
          </div>
        </div>

        <!-- Favorites -->
        <div v-if="favoriteDishes.length > 0" id="favorites">
          <div
            class="flex items-baseline justify-between border-b border-stone-850 pb-4 mb-8"
          >
            <h2 class="text-xl font-light text-sand-100 tracking-tight">
              Favorite Dishes
            </h2>
            <span class="text-[10px] uppercase tracking-widest text-stone-500">
              Based on your orders
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="dish in favoriteDishes"
              :key="dish.name"
              class="flex items-center gap-4 p-4 border border-stone-850 rounded-sm hover:border-terracotta-500/50 transition-colors"
            >
              <div
                class="w-16 h-16 bg-stone-900 rounded-sm overflow-hidden flex-shrink-0"
              >
                <img
                  :src="imageFor(dish.name)"
                  :alt="dish.name"
                  class="w-full h-full object-cover opacity-80"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-sand-100 truncate">
                  {{ dish.name }}
                </h4>
                <p
                  class="text-[10px] text-terracotta-400 uppercase tracking-[0.2em] mt-1"
                >
                  {{ dish.restaurant }}
                </p>
              </div>
              <button class="text-terracotta-500 flex-shrink-0" aria-label="Favorite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Addresses -->
        <div id="addresses">
          <div
            class="flex items-baseline justify-between border-b border-stone-850 pb-4 mb-8"
          >
            <h2 class="text-xl font-light text-sand-100 tracking-tight">
              Saved Addresses
            </h2>
            <button
              class="text-[10px] uppercase tracking-widest text-terracotta-400 hover:text-terracotta-300 font-semibold transition-colors"
            >
              + Add New
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="p-6 bg-[#0F0D0C] border border-stone-850 rounded-sm relative"
            >
              <span
                class="absolute top-4 right-4 text-[10px] uppercase tracking-widest font-bold text-terracotta-500"
              >
                Default
              </span>
              <h4
                class="text-xs font-semibold text-sand-400 uppercase tracking-widest mb-3"
              >
                Home
              </h4>
              <p class="text-sm text-sand-100 leading-relaxed font-light">
                1201 2nd Ave, Suite 300
                <br />
                Seattle, WA 98101
              </p>
              <div class="mt-6 flex gap-4">
                <button
                  class="text-[10px] uppercase tracking-widest text-stone-500 hover:text-sand-100 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  class="text-[10px] uppercase tracking-widest text-stone-500 hover:text-sand-100 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
            <div
              class="p-6 bg-[#0F0D0C] border border-stone-850 rounded-sm"
            >
              <h4
                class="text-xs font-semibold text-sand-400 uppercase tracking-widest mb-3"
              >
                Office
              </h4>
              <p class="text-sm text-sand-100 leading-relaxed font-light">
                1501 4th Ave
                <br />
                Seattle, WA 98101
              </p>
              <div class="mt-6 flex gap-4">
                <button
                  class="text-[10px] uppercase tracking-widest text-stone-500 hover:text-sand-100 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  class="text-[10px] uppercase tracking-widest text-stone-500 hover:text-sand-100 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer
      class="mt-24 py-12 border-t border-stone-900 flex flex-col items-center gap-4"
    >
      <NadiLogo :size="20" class="text-stone-800" />
      <p class="text-[0.65rem] uppercase tracking-[0.4em] text-stone-600">
        © 2026 Nadi Mama Hospitality Group
      </p>
    </footer>
  </div>
</template>
