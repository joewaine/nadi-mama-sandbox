<script setup lang="ts">
const route = useRoute()
const { loggedIn, user, logout, init } = useAuth()
const { cartCount, showCart } = useCart()
const showLogin = ref(false)

onMounted(() => init())

const navLinks = [
  { label: 'Mamnoon', to: '/menu/mamnoon' },
  { label: 'Mamnoon Street', to: '/menu/mamnoonstreet' },
  { label: 'Mbar', to: '/menu/mbar' },
]

const router = useRouter()

const showCartAside = computed(() => route.path.startsWith('/menu/'))
const hideChrome = computed(() => route.path === '/cart')

function openLogin() {
  showLogin.value = true
}

function openCart() {
  if (showCartAside.value) {
    showCart.value = true
  } else {
    router.push('/cart')
  }
}
</script>

<template>
  <div class="h-screen w-full bg-stone-950 text-sand-200 overflow-hidden flex font-sans antialiased">
    <main
      class="flex-1 h-full overflow-y-auto relative scroll-smooth flex flex-col"
    >
      <!-- Fixed Header -->
      <header
        v-if="!hideChrome"
        class="fixed top-0 left-0 z-50 header-gradient px-6 md:px-8 py-5 md:py-6 flex justify-between items-center transition-[right] duration-200"
        :class="showCartAside ? 'right-[380px]' : 'right-0'"
      >
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <NadiLogo
            :size="32"
            class="text-sand-200 group-hover:text-terracotta-500 transition-colors duration-300"
          />
          <span class="text-lg tracking-[0.2em] font-medium uppercase mt-1 text-sand-100">
            Nadi Mama
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-xs tracking-[0.15em] uppercase pb-1 border-b transition-colors"
            :class="
              route.path === link.to
                ? 'text-sand-100 font-medium border-terracotta-500'
                : 'text-sand-400 hover:text-sand-100 border-transparent hover:border-sand-400'
            "
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-4 md:gap-6">
          <NuxtLink
            v-if="loggedIn"
            to="/orders"
            class="hidden md:inline text-xs tracking-[0.15em] uppercase text-sand-400 hover:text-sand-100 transition-colors"
          >
            Account
          </NuxtLink>

          <button
            v-if="!showCartAside"
            @click="openCart"
            class="relative text-sand-400 hover:text-sand-100 transition-colors"
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-terracotta-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium"
            >
              {{ cartCount }}
            </span>
          </button>

          <button
            v-if="!loggedIn"
            @click="openLogin"
            class="bg-terracotta-500 hover:bg-terracotta-400 text-white px-5 md:px-6 py-2.5 rounded text-[11px] md:text-xs font-medium tracking-[0.1em] uppercase transition-colors"
          >
            Sign In
          </button>

          <button
            v-else
            @click="logout"
            class="flex items-center gap-2 text-sand-100"
            aria-label="Sign out"
          >
            <span
              class="w-8 h-8 rounded-full bg-stone-850 border border-stone-800 flex items-center justify-center text-[10px] uppercase tracking-tighter font-medium"
            >
              {{ (user?.name || 'U').slice(0, 2) }}
            </span>
            <span class="hidden lg:inline text-[11px] tracking-[0.1em] uppercase text-sand-400 hover:text-sand-100">
              Sign Out
            </span>
          </button>
        </div>
      </header>

      <slot />
    </main>

    <!-- Persistent cart aside on menu routes -->
    <CartDrawer v-if="showCartAside" @request-login="openLogin" />

    <!-- Login Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLogin && !loggedIn"
          class="fixed inset-0 z-[200] modal-overlay flex items-center justify-center p-6"
          @click.self="showLogin = false"
        >
          <LoginModal
            @close="showLogin = false"
            @success="showLogin = false"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
