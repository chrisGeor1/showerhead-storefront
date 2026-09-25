import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface CartContextValue {
  itemCount: number
  addToCart: (quantity: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [itemCount, setItemCount] = useState(0)

  const value = useMemo<CartContextValue>(
    () => ({
      itemCount,
      addToCart: (quantity: number) => setItemCount((count) => count + quantity),
    }),
    [itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
