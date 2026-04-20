<script setup lang="ts">
const emit = defineEmits<{ 'request-login': [] }>()

const { cart, cartTotal, cartCount, activeRestaurant, updateQty } = useCart()
const { loggedIn } = useAuth()
const router = useRouter()

const popularStaples = [
  { id: 'staple_falafel', name: 'Mamnoon Falafel', price: 1400 },
  { id: 'staple_hummus', name: 'Classic Hummus', price: 1200 },
  { id: 'staple_muhammara', name: 'Muhammara Dip', price: 1400 },
]

const { addItem } = useCart()

function addStaple(item: { id: string; name: string; price: number }) {
  addItem({ id: item.id, name: item.name, price: item.price })
}

function goCheckout() {
  if (!loggedIn.value) {
    emit('request-login')
    return
  }
  router.push('/cart')
}
</script>

<template>
  <aside
    class="w-[380px] bg-[#0A0908] border-l border-stone-850 flex flex-col h-full z-40 flex-shrink-0 shadow-2xl relative"
  >
    <!-- Header -->
    <div
      class="px-8 py-8 flex justify-between items-center border-b border-stone-850/50"
    >
      <div class="flex items-baseline gap-3">
        <h2 class="text-sm font-medium tracking-[0.15em] uppercase text-sand-100">
          Your Order
        </h2>
        <span
          v-if="cartCount > 0"
          class="text-xs text-terracotta-400 font-medium bg-terracotta-500/10 px-2 py-0.5 rounded-full"
        >
          {{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }}
        </span>
        <span
          v-else
          class="text-[0.65rem] text-stone-500 font-medium uppercase tracking-wider bg-stone-900 px-2 py-0.5 rounded border border-stone-850"
        >
          0 items
        </span>
      </div>
    </div>

    <!-- Ordering from (only when cart has items) -->
    <div
      v-if="cart.length > 0"
      class="px-8 py-4 border-b border-stone-850/50 bg-[#12100E]"
    >
      <p
        class="text-[0.65rem] uppercase tracking-widest text-stone-500 font-medium mb-1"
      >
        Ordering from
      </p>
      <p class="text-sm font-medium text-sand-200 uppercase tracking-wider">
        {{ activeRestaurant }}
      </p>
    </div>

    <!-- Body -->
    <div
      v-if="cart.length === 0"
      class="flex-1 flex flex-col overflow-y-auto no-scrollbar"
    >
      <!-- Empty -->
      <div class="px-8 py-16 flex flex-col items-center text-center gap-6">
        <div
          class="w-16 h-16 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div class="space-y-2">
          <h3 class="text-sand-100 font-medium tracking-tight">
            Your basket is empty
          </h3>
          <p class="text-sm text-sand-400 font-light leading-relaxed px-4">
            Taste the soul of the Levant. Start adding items from the menu to
            build your feast.
          </p>
        </div>
      </div>

      <div class="mt-4 px-8">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="text-[0.65rem] uppercase tracking-widest text-stone-500 font-bold"
          >
            Popular Staples
          </span>
          <div class="flex-1 h-[1px] bg-stone-900" />
        </div>

        <div class="space-y-1">
          <div
            v-for="staple in popularStaples"
            :key="staple.id"
            class="group flex items-center justify-between p-3 rounded hover:bg-stone-900/50 transition-all border border-transparent hover:border-stone-850 cursor-pointer"
            @click="addStaple(staple)"
          >
            <div class="flex flex-col gap-1">
              <span
                class="text-sm font-medium text-sand-200 group-hover:text-terracotta-400 transition-colors"
              >
                {{ staple.name }}
              </span>
              <span
                class="text-[0.65rem] text-stone-500 font-medium uppercase tracking-wider"
              >
                ${{ (staple.price / 100).toFixed(2) }}
              </span>
            </div>
            <button
              class="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-500 group-hover:bg-sand-100 group-hover:text-stone-950 group-hover:border-sand-100 transition-all"
              aria-label="Add to order"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Items -->
    <div
      v-else
      class="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar"
    >
      <div
        v-for="(item, i) in cart"
        :key="i"
        class="flex flex-col gap-3 group"
      >
        <div class="flex justify-between items-start">
          <h4 class="text-sm font-medium text-sand-100 pr-4">{{ item.name }}</h4>
          <span class="text-sm font-medium text-sand-100">
            ${{ ((item.price * item.qty) / 100).toFixed(2) }}
          </span>
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="text-sm text-terracotta-400">
            ${{ (item.price / 100).toFixed(2) }}
          </span>
          <div
            class="flex items-center gap-3 bg-[#1A1715] border border-stone-800 rounded-full px-1 py-1"
          >
            <button
              class="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-terracotta-400 hover:bg-stone-800 transition-colors"
              aria-label="Decrease or remove"
              @click="updateQty(i, item.qty - 1)"
            >
              <svg
                v-if="item.qty > 1"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
              </svg>
            </button>
            <span class="w-4 text-center text-sm font-medium text-sand-200">
              {{ item.qty }}
            </span>
            <button
              class="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-sand-100 hover:bg-stone-800 transition-colors"
              aria-label="Increase quantity"
              @click="updateQty(i, item.qty + 1)"
            >
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
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="mt-auto border-t border-stone-850/50 bg-[#0A0908] p-8"
    >
      <div class="flex justify-between items-center mb-6">
        <span
          class="text-sm font-medium uppercase tracking-widest"
          :class="cart.length ? 'text-sand-400' : 'text-stone-600'"
        >
          Subtotal
        </span>
        <span
          class="text-lg font-medium"
          :class="cart.length ? 'text-sand-100' : 'text-stone-600'"
        >
          ${{ (cartTotal / 100).toFixed(2) }}
        </span>
      </div>

      <button
        v-if="cart.length === 0"
        disabled
        class="w-full bg-stone-900 text-stone-500 cursor-not-allowed px-6 py-4 rounded text-sm font-medium tracking-[0.05em] uppercase border border-stone-850 flex justify-center items-center gap-2"
      >
        Add Items to Continue
      </button>
      <button
        v-else-if="!loggedIn"
        class="w-full bg-sand-100 text-stone-950 hover:bg-white px-6 py-4 rounded text-sm font-medium tracking-[0.05em] uppercase transition-colors"
        @click="emit('request-login')"
      >
        Sign in to place your order
      </button>
      <button
        v-else
        class="w-full bg-terracotta-500 hover:bg-terracotta-400 text-white px-6 py-4 rounded text-sm font-medium tracking-[0.1em] uppercase transition-colors flex justify-center items-center gap-2"
        @click="goCheckout"
      >
        Checkout
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
      </button>
    </div>
  </aside>
</template>
