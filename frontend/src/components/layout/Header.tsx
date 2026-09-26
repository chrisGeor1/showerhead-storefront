import { useState } from 'react'
import { BRAND_NAME, NAV_LINKS } from '../../data/content'
import { useCart } from '../../context/CartContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/60 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="font-display text-headline-sm font-bold tracking-tight text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {BRAND_NAME}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-label-md text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#purchase"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {itemCount}
              </span>
            )}
          </a>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-outline-variant/60 bg-surface transition-[max-height] duration-300 ease-out md:hidden ${
          menuOpen ? 'max-h-64' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 font-display text-label-lg text-on-surface transition-colors hover:bg-surface-container-low"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13L5.4 5M7 13l-1.5 5h11.6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
