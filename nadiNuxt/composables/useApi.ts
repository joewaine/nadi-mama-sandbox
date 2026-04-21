import { menus } from '~/data/menus'

const ORDERS_KEY = 'sandbox_orders'
const SEEDED_KEY = 'sandbox_orders_seeded'

function seedOrders() {
  const now = Date.now()
  const day = 86_400_000
  return [
    {
      _id: 'seed-mamnoon-1',
      status: 'Closed',
      orderInfo: {
        timeStamp: now - 3 * day,
        restaurant: 'Mamnoon',
        confirmation_code: 'nadi-fk8xq3r9m',
        charges: {
          total: 9840,
          preTotal: 8190,
          fees: 350,
          taxes: 1300,
          items: [
            { name: 'Hummus Beiruti', price: 1400, quantity: 1 },
            { name: 'Lamb Kefta Kebab', price: 3400, quantity: 1 },
            { name: 'Rose Knafeh', price: 1400, quantity: 1 },
            { name: 'Fattoush', price: 1600, quantity: 1 },
          ],
        },
      },
      shippingInfo: { tracking_number: 'NM8290-SEA' },
    },
    {
      _id: 'seed-mbar-1',
      status: 'Closed',
      orderInfo: {
        timeStamp: now - 10 * day,
        restaurant: 'Mbar',
        confirmation_code: 'nadi-2pl7m4k0s',
        charges: {
          total: 7260,
          preTotal: 6100,
          fees: 350,
          taxes: 810,
          items: [
            { name: 'Grilled Shrimp Kebab', price: 2800, quantity: 1 },
            { name: 'Bosphorus Spritz', price: 1600, quantity: 2 },
            { name: 'Pistachio Knafeh', price: 1400, quantity: 1 },
          ],
        },
      },
    },
  ]
}

function loadOrders(): any[] {
  if (!import.meta.client) return []
  try {
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(seedOrders()))
      localStorage.setItem(SEEDED_KEY, '1')
    }
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveOrder(order: any) {
  if (!import.meta.client) return
  const all = loadOrders()
  all.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all))
}

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

export function useApi() {
  async function get<T = any>(path: string): Promise<T> {
    const menuMatch = path.match(/^\/product\/upserve_mongo\/([^/?]+)/)
    if (menuMatch) {
      const slug = menuMatch[1]
      const menu = menus[slug] ?? menus.mamnoon
      return delay({ doc: [{ menu }] } as T)
    }

    if (path.startsWith('/order/email/')) {
      return delay({ user: loadOrders() } as T)
    }

    throw new Error(`[sandbox] Unmocked GET ${path}`)
  }

  async function post<T = any>(path: string, body?: any): Promise<T> {
    if (path === '/user/login') {
      const email = body?.email || 'demo@example.com'
      const name = email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase())
      return delay({
        user: { _id: 'sandbox-' + email, email, name },
        token: 'sandbox-token-' + Date.now(),
      } as T)
    }

    if (path === '/order/addorder') {
      const confCode = body?.orderInfo?.confirmation_code || 'nadi-' + Math.random().toString(36).slice(2, 11)
      saveOrder({
        _id: 'order-' + Date.now(),
        status: 'In Progress',
        orderInfo: body?.orderInfo ?? {},
        shippingInfo: { tracking_number: 'NM' + Math.floor(1000 + Math.random() * 9000) + '-SEA' },
      })
      return delay({ ok: true, confirmation_code: confCode } as T)
    }

    if (path === '/confirmationemail') {
      return delay({ ok: true } as T)
    }

    throw new Error(`[sandbox] Unmocked POST ${path}`)
  }

  return { get, post, baseURL: 'sandbox' }
}
