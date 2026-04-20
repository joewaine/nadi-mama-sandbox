<script setup lang="ts">
const { cart, cartTotal, activeRestaurant, clearCart } = useCart()
const { loggedIn, user } = useAuth()
const { post } = useApi()
const router = useRouter()

const placing = ref(false)
const confirmation = ref<any>(null)

const form = reactive({
  address: '',
  apartment: '',
  city: 'Seattle',
  instructions: '',
  cardholder: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
})

const deliveryFee = 350
const taxRate = 0.101
const taxAmount = computed(() => Math.round(cartTotal.value * taxRate))
const grandTotal = computed(() =>
  cart.value.length === 0 ? 0 : cartTotal.value + deliveryFee + taxAmount.value,
)

async function placeOrder() {
  if (!loggedIn.value) return
  if (cart.value.length === 0) return
  placing.value = true

  const confCode = 'nadi-' + Math.random().toString(36).slice(2, 13)
  const orderId = Math.random().toString(36).slice(2, 31) + '_' + Date.now()
  const totalCents = grandTotal.value

  try {
    await post('/order/addorder', {
      payInfo: {
        uniqueTransId: 'sandbox_' + Date.now(),
        data: {
          uniqueTransId: 'sandbox_' + Date.now(),
          resultMessage: 'Approved',
          maskedAccount: 'XXXXXXXXXXXX4242',
          amount: (totalCents / 100).toFixed(2),
        },
      },
      orderInfo: {
        timeStamp: Date.now(),
        restaurant: activeRestaurant.value,
        id: orderId,
        preorder: false,
        scheduled_time: null,
        time_placed: new Date().toISOString(),
        confirmation_code: confCode,
        charges: {
          total: totalCents,
          preTotal: cartTotal.value,
          fees: deliveryFee,
          taxes: taxAmount.value,
          tip: {
            amountOptions: [],
            amount: 0,
            payment_type: 'Generic Online Ordering Integrated',
          },
          items: cart.value.map((c, i) => ({
            name: c.name,
            price: c.price,
            quantity: c.qty,
            cartId: 'cart_' + i,
            returned: false,
          })),
        },
        fulfillment_info: {
          type: 'delivery',
          estimated_fulfillment_time: new Date().toISOString(),
          customer: {
            email: user.value?.email || '',
            phone: '2065551234',
            first_name: user.value?.name || 'Guest',
          },
          instructions: form.instructions,
          no_tableware: false,
          delivery_info: {
            is_managed_delivery: false,
            address: {
              city: form.city,
              state: 'WA',
              zip_code: '',
              address_line1: form.address,
              address_line2: form.apartment,
            },
          },
        },
        payments: {
          payments: [
            {
              payment_type: 'Generic Online Ordering Integrated',
              amount: totalCents,
            },
          ],
        },
        sms: false,
        billing: {
          billing_name: form.cardholder || user.value?.name || '',
          billing_address: form.address,
          billing_postal_code: '',
        },
      },
    })

    await post('/confirmationemail', {
      restaurant: activeRestaurant.value,
      confirmation_code: confCode,
      scheduled_time: new Date().toISOString(),
      charges: {
        items: cart.value.map(c => ({
          name: c.name,
          price: c.price,
          quantity: c.qty,
        })),
      },
      fulfillment_info: {
        type: 'delivery',
        customer: {
          email: user.value?.email,
          phone: '2065551234',
          first_name: user.value?.name,
        },
      },
    })

    confirmation.value = {
      code: confCode,
      restaurant: activeRestaurant.value,
      total: (totalCents / 100).toFixed(2),
      email: user.value?.email,
      items: cart.value.map(c => ({ ...c })),
      subtotal: cartTotal.value,
      tax: taxAmount.value,
      fee: deliveryFee,
    }
    clearCart()
  } catch (e) {
    console.error('Order failed:', e)
  }
  placing.value = false
}
</script>

<template>
  <div class="flex w-full min-h-full">
    <!-- Main -->
    <div class="flex-1 min-w-0">
      <!-- Header -->
      <header
        class="sticky top-0 z-50 header-gradient px-8 md:px-12 py-6 md:py-8 flex items-center justify-between"
      >
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <NadiLogo :size="28" class="text-sand-100" />
          <span
            class="text-sm tracking-[0.2em] font-medium uppercase mt-0.5 text-sand-100"
          >
            Nadi Mama
          </span>
        </NuxtLink>
        <div class="flex items-center gap-6">
          <NuxtLink
            v-if="!confirmation"
            to="/menu/mamnoon"
            class="text-[11px] md:text-xs tracking-[0.15em] uppercase text-sand-400 hover:text-sand-100 transition-colors"
          >
            Back to Menu
          </NuxtLink>
        </div>
      </header>

      <!-- Confirmation -->
      <main
        v-if="confirmation"
        class="confirmation-bg pt-16 pb-24 px-6 md:px-8"
      >
        <div class="max-w-2xl mx-auto flex flex-col items-center">
          <div class="mb-8">
            <svg class="w-24 h-24" viewBox="0 0 52 52">
              <circle
                class="checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="checkmark-check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                stroke="#D35C3A"
                stroke-width="3"
              />
            </svg>
          </div>

          <div class="text-center mb-12 fade-up">
            <h1 class="text-4xl font-light text-sand-100 mb-4 tracking-tight">
              Shukran! Your order is placed.
            </h1>
            <p class="text-sand-400 text-lg font-light">
              We've sent a confirmation to
              <span class="text-sand-200">{{ confirmation.email }}</span>
            </p>
          </div>

          <div
            class="w-full bg-[#1A1715] border border-stone-850 rounded-lg p-8 mb-8 grid grid-cols-2 gap-8 fade-up"
            style="animation-delay: 0.2s"
          >
            <div>
              <p
                class="text-[0.65rem] uppercase tracking-[0.2em] text-stone-500 font-semibold mb-2"
              >
                Estimated Pickup
              </p>
              <p class="text-3xl font-light text-terracotta-400">35 min</p>
              <p class="text-xs text-sand-400 mt-1">
                {{ new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}
              </p>
            </div>
            <div class="border-l border-stone-850 pl-8">
              <p
                class="text-[0.65rem] uppercase tracking-[0.2em] text-stone-500 font-semibold mb-2"
              >
                Order Number
              </p>
              <p class="text-3xl font-light text-sand-100 font-mono">
                {{ confirmation.code.split('-')[1]?.slice(0, 4).toUpperCase() || 'NM' }}
              </p>
              <p class="text-xs text-sand-400 mt-1">
                {{ confirmation.restaurant }} · Seattle, WA
              </p>
            </div>
          </div>

          <div
            class="w-full bg-[#0A0908] border border-stone-850 rounded-lg overflow-hidden fade-up"
            style="animation-delay: 0.4s"
          >
            <div
              class="px-8 py-6 border-b border-stone-850/50 flex justify-between items-center"
            >
              <h2
                class="text-sm font-medium tracking-[0.15em] uppercase text-sand-100"
              >
                Order Summary
              </h2>
              <span class="text-xs text-sand-400">
                {{ confirmation.items.length }} {{ confirmation.items.length === 1 ? 'Item' : 'Items' }}
              </span>
            </div>

            <div class="p-8 space-y-6">
              <div
                v-for="item in confirmation.items"
                :key="item.id"
                class="flex justify-between items-start"
              >
                <div>
                  <p class="text-sm font-medium text-sand-100">
                    {{ item.qty }} × {{ item.name }}
                  </p>
                </div>
                <span class="text-sm text-sand-200">
                  ${{ ((item.price * item.qty) / 100).toFixed(2) }}
                </span>
              </div>

              <div class="pt-6 border-t border-stone-850/50 space-y-3">
                <div class="flex justify-between text-xs text-sand-400">
                  <span>Subtotal</span>
                  <span>${{ (confirmation.subtotal / 100).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-xs text-sand-400">
                  <span>Delivery Fee</span>
                  <span>${{ (confirmation.fee / 100).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-xs text-sand-400">
                  <span>Tax</span>
                  <span>${{ (confirmation.tax / 100).toFixed(2) }}</span>
                </div>
                <div
                  class="flex justify-between text-sm font-medium text-sand-100 pt-2"
                >
                  <span>Total</span>
                  <span>${{ confirmation.total }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="mt-12 flex gap-4 fade-up"
            style="animation-delay: 0.6s"
          >
            <NuxtLink
              to="/"
              class="px-8 py-3 border border-stone-800 text-sand-400 hover:text-sand-100 hover:border-stone-600 rounded text-xs font-medium tracking-[0.1em] uppercase transition-all"
            >
              Return Home
            </NuxtLink>
            <NuxtLink
              to="/orders"
              class="px-8 py-3 bg-terracotta-500 hover:bg-terracotta-400 text-white rounded text-xs font-medium tracking-[0.1em] uppercase transition-all"
            >
              Track Progress
            </NuxtLink>
          </div>

          <p class="mt-8 text-[0.65rem] uppercase tracking-widest text-stone-500 font-medium">
            Sandbox mode · emails & SMS are mocked in the backend console
          </p>
        </div>
      </main>

      <!-- Empty -->
      <main
        v-else-if="cart.length === 0"
        class="max-w-3xl mx-auto px-8 md:px-12 py-24 text-center"
      >
        <div class="flex flex-col items-center gap-6">
          <div
            class="w-20 h-20 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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
          <h1 class="text-3xl font-light text-sand-100 tracking-tight">
            Your basket is empty
          </h1>
          <p class="text-sand-400 font-light max-w-sm">
            Start your feast — browse our three kitchens and build an order.
          </p>
          <NuxtLink
            to="/"
            class="mt-2 bg-terracotta-500 hover:bg-terracotta-400 text-white px-8 py-3 rounded text-xs font-medium tracking-[0.15em] uppercase transition-colors"
          >
            Browse Restaurants
          </NuxtLink>
        </div>
      </main>

      <!-- Checkout form -->
      <main
        v-else
        class="max-w-3xl mx-auto px-8 md:px-12 py-12"
      >
        <h1
          class="text-4xl font-light text-sand-100 mb-2 tracking-tight"
        >
          Checkout
        </h1>
        <p
          class="text-[0.65rem] uppercase tracking-[0.25em] text-stone-500 font-semibold mb-12"
        >
          Ordering from {{ activeRestaurant }}
        </p>

        <form class="space-y-16" @submit.prevent="placeOrder">
          <!-- Delivery -->
          <section>
            <div class="flex items-center gap-4 mb-8">
              <span
                class="text-xs font-medium text-terracotta-500 border border-terracotta-500/30 px-2 py-0.5 rounded"
              >
                01
              </span>
              <h2
                class="text-sm tracking-[0.15em] uppercase font-medium text-sand-100"
              >
                Delivery Details
              </h2>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="col-span-2 space-y-2">
                <label
                  class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                >
                  Street Address
                </label>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="123 Pike St"
                  class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label
                  class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                >
                  Apartment / Suite
                </label>
                <input
                  v-model="form.apartment"
                  type="text"
                  placeholder="Apt 4B"
                  class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label
                  class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                >
                  City
                </label>
                <input
                  v-model="form.city"
                  type="text"
                  class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all"
                />
              </div>
              <div class="col-span-2 space-y-2">
                <label
                  class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                >
                  Delivery Instructions
                </label>
                <textarea
                  v-model="form.instructions"
                  rows="3"
                  placeholder="Gate code or drop-off preference…"
                  class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all resize-none"
                />
              </div>
            </div>
          </section>

          <!-- Payment -->
          <section>
            <div class="flex items-center gap-4 mb-8">
              <span
                class="text-xs font-medium text-terracotta-500 border border-terracotta-500/30 px-2 py-0.5 rounded"
              >
                02
              </span>
              <h2
                class="text-sm tracking-[0.15em] uppercase font-medium text-sand-100"
              >
                Payment Method
              </h2>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label
                  class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                >
                  Cardholder Name
                </label>
                <input
                  v-model="form.cardholder"
                  type="text"
                  :placeholder="user?.name || 'Your name'"
                  class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label
                  class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                >
                  Card Number
                </label>
                <div class="relative">
                  <input
                    v-model="form.cardNumber"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all"
                  />
                  <div
                    class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2"
                  >
                    <div class="w-8 h-5 bg-stone-800 rounded-sm opacity-50" />
                    <div class="w-8 h-5 bg-stone-800 rounded-sm opacity-50" />
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label
                    class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                  >
                    Expiry Date
                  </label>
                  <input
                    v-model="form.expiry"
                    type="text"
                    placeholder="MM / YY"
                    class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[0.65rem] uppercase tracking-widest text-sand-400 font-medium"
                  >
                    CVC
                  </label>
                  <input
                    v-model="form.cvc"
                    type="text"
                    placeholder="•••"
                    class="w-full bg-stone-900 border border-stone-800 rounded px-4 py-3 text-sm text-sand-100 placeholder:text-stone-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          <div class="pt-8 border-t border-stone-900">
            <p class="text-xs text-stone-500 leading-relaxed mb-8 font-light">
              By clicking "Place Order", you agree to Nadi Mama's Terms of
              Service and Privacy Policy. Payment information is tokenized and
              securely processed. This is a sandboxed demo — no card will be
              charged.
            </p>

            <button
              v-if="loggedIn"
              type="submit"
              :disabled="placing"
              class="w-full bg-terracotta-500 hover:bg-terracotta-400 disabled:opacity-50 text-white py-5 rounded text-sm font-medium tracking-[0.1em] uppercase transition-all shadow-lg shadow-terracotta-500/10"
            >
              {{ placing ? 'Processing…' : `Place Order — $${(grandTotal / 100).toFixed(2)}` }}
            </button>
            <p
              v-else
              class="text-center text-sm text-sand-400 font-light"
            >
              You need to be signed in to place this order.
            </p>
          </div>
        </form>
      </main>
    </div>

    <!-- Order summary aside (only during checkout, not on empty/confirmation) -->
    <aside
      v-if="!confirmation && cart.length > 0"
      class="hidden lg:flex w-[420px] bg-[#0A0908] border-l border-stone-850 flex-col flex-shrink-0 sticky top-0 h-screen self-start"
    >
      <div class="px-10 py-12 flex flex-col h-full">
        <div class="flex items-center justify-between mb-10">
          <h3
            class="text-sm font-medium tracking-[0.15em] uppercase text-sand-100"
          >
            Order Summary
          </h3>
          <span class="text-xs text-sand-400">
            {{ cart.length }} {{ cart.length === 1 ? 'Item' : 'Items' }}
          </span>
        </div>

        <div
          class="flex-1 space-y-8 overflow-y-auto no-scrollbar"
        >
          <div
            v-for="(item, i) in cart"
            :key="i"
            class="flex justify-between items-start"
          >
            <div>
              <h4 class="text-sm font-medium text-sand-100 mb-1">
                {{ item.name }}
              </h4>
              <span class="text-xs text-terracotta-400 mt-2 block">
                Qty: {{ item.qty }}
              </span>
            </div>
            <span class="text-sm font-medium text-sand-200">
              ${{ ((item.price * item.qty) / 100).toFixed(2) }}
            </span>
          </div>
        </div>

        <div
          class="mt-auto pt-10 border-t border-stone-900 space-y-4"
        >
          <div class="flex justify-between text-xs text-sand-400">
            <span>Subtotal</span>
            <span>${{ (cartTotal / 100).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-xs text-sand-400">
            <span>Delivery Fee</span>
            <span>${{ (deliveryFee / 100).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-xs text-sand-400 pb-2">
            <span>Estimated Tax</span>
            <span>${{ (taxAmount / 100).toFixed(2) }}</span>
          </div>
          <div
            class="flex justify-between items-center pt-4 border-t border-stone-900"
          >
            <span class="text-sm font-medium text-sand-100">Total</span>
            <span class="text-xl font-medium text-sand-100">
              ${{ (grandTotal / 100).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
