<script setup lang="ts">
const route = useRoute()
const { loggedIn, user, logout, init } = useAuth()
const { cartCount, showCart } = useCart()
const showLogin = ref(false)
const showMobileNav = ref(false)

onMounted(() => init())

const navLinks = [
  { label: 'Mamnoon', to: '/menu/mamnoon' },
  { label: 'Mamnoon Street', to: '/menu/mamnoonstreet' },
  { label: 'Mbar', to: '/menu/mbar' },
]

const router = useRouter()

const showCartAside = computed(() => route.path.startsWith('/menu/'))
const hideChrome = computed(() => route.path === '/cart')

watch(() => route.path, () => {
  showMobileNav.value = false
  showCart.value = false
})

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
        class="fixed top-0 left-0 right-0 z-50 header-gradient px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex justify-between items-center transition-[right] duration-200"
        :class="showCartAside ? 'lg:right-[380px]' : ''"
      >
        <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3 group min-w-0">
          <NadiLogo
            :size="28"
            class="text-sand-200 group-hover:text-terracotta-500 transition-colors duration-300 flex-shrink-0 sm:w-8 sm:h-8"
          />
          <span class="text-sm sm:text-base md:text-lg tracking-[0.15em] sm:tracking-[0.2em] font-medium uppercase mt-0.5 sm:mt-1 text-sand-100 truncate">
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

        <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
          <NuxtLink
            v-if="loggedIn"
            to="/orders"
            class="hidden md:inline text-xs tracking-[0.15em] uppercase text-sand-400 hover:text-sand-100 transition-colors"
          >
            Account
          </NuxtLink>

          <button
            @click="openCart"
            class="relative text-sand-400 hover:text-sand-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            :class="{ 'lg:hidden': showCartAside }"
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
              class="absolute top-1.5 right-1.5 bg-terracotta-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium"
            >
              {{ cartCount }}
            </span>
          </button>

          <button
            v-if="!loggedIn"
            @click="openLogin"
            class="bg-terracotta-500 hover:bg-terracotta-400 text-white px-4 sm:px-5 md:px-6 py-2.5 min-h-[40px] rounded text-[10px] sm:text-[11px] md:text-xs font-medium tracking-[0.1em] uppercase transition-colors whitespace-nowrap"
          >
            Sign In
          </button>

          <button
            v-else
            @click="logout"
            class="flex items-center gap-2 text-sand-100 min-h-[40px]"
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

          <button
            @click="showMobileNav = !showMobileNav"
            class="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-sand-400 hover:text-sand-100 transition-colors"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line v-if="!showMobileNav" x1="4" y1="7" x2="20" y2="7" />
              <line v-if="!showMobileNav" x1="4" y1="12" x2="20" y2="12" />
              <line v-if="!showMobileNav" x1="4" y1="17" x2="20" y2="17" />
              <line v-if="showMobileNav" x1="6" y1="6" x2="18" y2="18" />
              <line v-if="showMobileNav" x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Mobile nav drawer -->
      <Transition name="fade">
        <div
          v-if="showMobileNav && !hideChrome"
          class="md:hidden fixed inset-x-0 top-[60px] sm:top-[68px] z-40 bg-stone-950/95 backdrop-blur-lg border-b border-stone-850 p-6 flex flex-col gap-2"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-3 rounded-sm text-sm tracking-[0.15em] uppercase font-medium transition-colors min-h-[44px] flex items-center"
            :class="route.path === link.to ? 'bg-stone-900 text-sand-100' : 'text-sand-400 hover:bg-stone-900/50 hover:text-sand-100'"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            v-if="loggedIn"
            to="/orders"
            class="px-4 py-3 rounded-sm text-sm tracking-[0.15em] uppercase font-medium transition-colors min-h-[44px] flex items-center border-t border-stone-900 mt-2"
            :class="route.path === '/orders' ? 'text-sand-100' : 'text-sand-400'"
          >
            Account
          </NuxtLink>
        </div>
      </Transition>

      <slot />
    </main>

    <!-- Persistent cart aside on menu routes (desktop only) -->
    <CartDrawer
      v-if="showCartAside"
      class="hidden lg:flex"
      @request-login="openLogin"
    />

    <!-- Mobile cart drawer overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showCart && showCartAside"
          class="lg:hidden fixed inset-0 z-[150] modal-overlay flex"
          @click.self="showCart = false"
        >
          <div class="ml-auto h-full w-full max-w-[380px] flex relative">
            <CartDrawer
              class="!w-full"
              @request-login="() => { showCart = false; openLogin() }"
            />
            <button
              class="absolute top-4 right-4 z-10 min-w-[44px] min-h-[44px] rounded-full bg-stone-900/80 border border-stone-800 flex items-center justify-center text-sand-100"
              aria-label="Close cart"
              @click="showCart = false"
            >
              <svg
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
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Login Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLogin && !loggedIn"
          class="fixed inset-0 z-[200] modal-overlay flex items-center justify-center p-4 sm:p-6"
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
