import { useVariant } from '../../context/VariantContext'

interface StyleSwitcherProps {
  size?: 'md' | 'sm'
}

export default function StyleSwitcher({ size = 'md' }: StyleSwitcherProps) {
  const { variants, variant, setVariantId } = useVariant()

  const padding = size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2'
  const text = size === 'sm' ? 'text-label-sm' : 'text-label-md'

  return (
    <div
      role="radiogroup"
      aria-label="Product style"
      className="inline-flex flex-wrap items-center gap-2 rounded-full bg-surface-container-low p-1.5"
    >
      {variants.map((v) => {
        const selected = v.id === variant.id
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setVariantId(v.id)}
            className={`flex items-center gap-2 rounded-full font-display ${text} ${padding} transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              selected
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full ring-1 ring-inset ring-black/10"
              style={{ backgroundColor: v.swatch }}
            />
            {v.label}
          </button>
        )
      })}
    </div>
  )
}
