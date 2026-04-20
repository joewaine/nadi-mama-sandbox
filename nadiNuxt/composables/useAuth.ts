interface User {
  name: string
  email: string
  _id: string
}

const loggedIn = ref(false)
const user = ref<User | null>(null)
const token = ref('')

export function useAuth() {
  const { post } = useApi()

  function init() {
    if (import.meta.client) {
      const saved = localStorage.getItem('sandbox_token')
      const savedEmail = localStorage.getItem('sandbox_email')
      const savedName = localStorage.getItem('sandbox_name')
      if (saved && savedEmail) {
        token.value = saved
        loggedIn.value = true
        user.value = { email: savedEmail, name: savedName || '', _id: '' }
      }
    }
  }

  async function login(email: string, password: string) {
    const res = await post<{ user: User; token: string }>('/user/login', { email, password })
    if (res.token) {
      token.value = res.token
      user.value = res.user
      loggedIn.value = true
      localStorage.setItem('sandbox_token', res.token)
      localStorage.setItem('sandbox_email', res.user.email)
      localStorage.setItem('sandbox_name', res.user.name)
    }
    return res
  }

  function logout() {
    token.value = ''
    user.value = null
    loggedIn.value = false
    localStorage.removeItem('sandbox_token')
    localStorage.removeItem('sandbox_email')
    localStorage.removeItem('sandbox_name')
  }

  return { loggedIn, user, token, login, logout, init }
}
