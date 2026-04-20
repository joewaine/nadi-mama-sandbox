interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

const cart = ref<CartItem[]>([])
const activeRestaurant = ref('Mamnoon')
const showCart = ref(false)

export function useCart() {
  function addItem(item: { id: string; name: string; price: number }) {
    const existing = cart.value.find(c => c.id === item.id)
    if (existing) {
      existing.qty++
    } else {
      cart.value.push({ ...item, qty: 1 })
    }
  }

  function removeItem(index: number) {
    cart.value.splice(index, 1)
  }

  function updateQty(index: number, qty: number) {
    if (qty <= 0) {
      cart.value.splice(index, 1)
    } else {
      cart.value[index].qty = qty
    }
  }

  function clearCart() {
    cart.value = []
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  })

  const cartCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.qty, 0)
  })

  return { cart, activeRestaurant, showCart, addItem, removeItem, updateQty, clearCart, cartTotal, cartCount }
}
