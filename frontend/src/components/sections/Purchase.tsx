import { useState, type ChangeEvent } from 'react'
import Button from '../ui/Button'
import StyleSwitcher from '../ui/StyleSwitcher'
import { useCart } from '../../context/CartContext'
import { useVariant } from '../../context/VariantContext'

export default function Purchase() {
  const { addToCart } = useCart()
  const { variant } = useVariant()
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    setPrice(Number.isNaN(value) ? 0 : Math.max(0, value))
  }

  const adjustQuantity = (delta: number) => {
    setQuantity((qty) => Math.max(1, qty + delta))
  }

  const handleAddToCart = () => {
    addToCart(quantity)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2000)
  }

  const total = (price * quantity).toFixed(2)

  return (
    <section id="purchase" className="w-full bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 overflow-hidden rounded-3xl bg-surface-container-lowest shadow-xl lg:grid-cols-2 lg:items-center">
          <div className="aspect-[4/5] w-full max-h-[560px] overflow-hidden bg-surface-container-high">
            <img
              key={variant.id}
              src={variant.hero.heroImage.src}
              alt={variant.hero.heroImage.alt}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-6 p-6 sm:p-10">
            <div className="space-y-3">
              <span className="font-display text-label-sm font-bold uppercase tracking-widest text-primary">
                Shop
              </span>
              <StyleSwitcher size="sm" />
              <h2 className="font-display text-headline-xl text-on-surface">
                {variant.productName}
              </h2>
              <p className="font-body text-body-md text-on-surface-variant">
                {variant.productSummary}
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="price-input"
                className="font-display text-label-md font-semibold text-on-surface"
              >
                Price (USD) — editable placeholder
              </label>
              <div className="flex items-center gap-2">
                <span className="font-display text-headline-md text-on-surface-variant" aria-hidden="true">
                  $
                </span>
                <input
                  id="price-input"
                  type="number"
                  min={0}
                  step={0.01}
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  aria-describedby="price-hint"
                  className="w-32 rounded-lg border border-outline-variant bg-surface px-3 py-2 font-display text-headline-md text-on-surface outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                />
              </div>
              <p id="price-hint" className="font-body text-label-sm text-on-surface-variant">
                No price was provided in the uploaded design — set your final price here.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-label-md font-semibold text-on-surface">
                Quantity
              </span>
              <div className="flex items-center gap-3 rounded-full bg-surface-container-low px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => adjustQuantity(-1)}
                  aria-label="Decrease quantity"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  −
                </button>
                <span className="w-6 text-center font-display text-label-lg text-on-surface" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => adjustQuantity(1)}
                  aria-label="Increase quantity"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant/60 pt-4">
              <span className="font-body text-body-md text-on-surface-variant">Total</span>
              <span className="font-display text-headline-md text-on-surface">${total}</span>
            </div>

            <Button size="lg" onClick={handleAddToCart} aria-live="polite">
              {justAdded ? 'Added to Cart ✓' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
