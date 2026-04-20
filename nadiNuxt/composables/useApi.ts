export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl as string

  async function get<T = any>(path: string): Promise<T> {
    const res = await $fetch<T>(path, { baseURL })
    return res
  }

  async function post<T = any>(path: string, body?: any): Promise<T> {
    const res = await $fetch<T>(path, { baseURL, method: 'POST', body })
    return res
  }

  return { get, post, baseURL }
}
