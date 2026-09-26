import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { VARIANTS } from '../data/content'
import type { ProductVariant } from '../types'

interface VariantContextValue {
  variants: ProductVariant[]
  variant: ProductVariant
  setVariantId: (id: string) => void
}

const VariantContext = createContext<VariantContextValue | null>(null)

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variantId, setVariantId] = useState(VARIANTS[0].id)

  const value = useMemo<VariantContextValue>(() => {
    const variant = VARIANTS.find((v) => v.id === variantId) ?? VARIANTS[0]
    return { variants: VARIANTS, variant, setVariantId }
  }, [variantId])

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
}

export function useVariant() {
  const ctx = useContext(VariantContext)
  if (!ctx) throw new Error('useVariant must be used within a VariantProvider')
  return ctx
}
