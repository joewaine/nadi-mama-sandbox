<script setup lang="ts">
const emit = defineEmits(['close', 'success'])
const { login } = useAuth()

const email = ref('demo@example.com')
const password = ref('password123')
const error = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    emit('success')
  } catch (e) {
    error.value = 'Invalid credentials. Try demo@example.com / password123'
  }
  loading.value = false
}
</script>

<template>
  <div
    class="relative bg-stone-900 w-full max-w-[480px] max-h-[calc(100vh-32px)] overflow-y-auto rounded-sm border border-stone-850 shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
  >
    <!-- Header -->
    <div
      class="px-6 sm:px-10 pt-10 sm:pt-12 pb-6 sm:pb-8 flex flex-col items-center text-center border-b border-stone-850/30"
    >
      <NadiLogo :size="48" class="text-terracotta-500 mb-8" />
      <h2
        class="text-2xl font-light text-sand-100 tracking-[0.1em] uppercase mb-2"
      >
        Welcome Back
      </h2>
      <p class="text-sm text-sand-400 font-light max-w-[320px]">
        Sign in to your Nadi Mama account to place your order and track its
        journey.
      </p>
    </div>

    <!-- Demo credentials pill -->
    <div
      class="mx-6 sm:mx-10 mt-6 sm:mt-8 px-4 py-3 bg-terracotta-500/10 border border-terracotta-500/30 rounded-sm"
    >
      <p
        class="text-[0.65rem] uppercase tracking-[0.15em] text-terracotta-400 font-semibold"
      >
        Sandbox Demo
      </p>
      <p class="text-xs text-sand-300 mt-1 font-light">
        demo@example.com · password123
      </p>
    </div>

    <!-- Form -->
    <form class="p-6 sm:p-10 space-y-5 sm:space-y-6" @submit.prevent="submit">
      <div class="space-y-2">
        <label
          class="text-[0.65rem] uppercase tracking-[0.2em] text-sand-400 font-medium ml-1"
        >
          Email Address
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="name@example.com"
          class="w-full bg-stone-950 border border-stone-800 rounded-sm px-4 py-3.5 text-sm text-sand-100 placeholder:text-stone-700 transition-colors"
        />
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label
            class="text-[0.65rem] uppercase tracking-[0.2em] text-sand-400 font-medium ml-1"
          >
            Password
          </label>
          <a
            href="#"
            class="text-[0.65rem] uppercase tracking-[0.2em] text-terracotta-500 font-medium hover:text-terracotta-400 transition-colors"
            @click.prevent
          >
            Forgot?
          </a>
        </div>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full bg-stone-950 border border-stone-800 rounded-sm px-4 py-3.5 text-sm text-sand-100 placeholder:text-stone-700 transition-colors"
        />
      </div>

      <p
        v-if="error"
        class="text-[0.7rem] tracking-wide text-terracotta-400 font-light"
      >
        {{ error }}
      </p>

      <div class="pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full min-h-[52px] bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white py-4 rounded-sm text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 shadow-lg shadow-terracotta-500/10"
        >
          {{ loading ? 'Signing In…' : 'Sign In & Continue' }}
        </button>
      </div>
    </form>

    <div class="px-6 sm:px-10 pb-8 sm:pb-12 text-center">
      <p class="text-xs text-sand-400 font-light">
        New to Nadi Mama?
        <a
          href="#"
          class="text-sand-100 font-medium hover:text-terracotta-400 underline underline-offset-4 decoration-stone-700 ml-1 transition-colors"
          @click.prevent
        >
          Create an account
        </a>
      </p>
    </div>

    <!-- Close -->
    <button
      class="absolute top-3 right-3 sm:top-6 sm:right-6 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-500 hover:text-sand-100 transition-colors"
      aria-label="Close"
      @click="emit('close')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
</template>
