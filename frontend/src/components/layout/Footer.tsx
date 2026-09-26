import { useState, type FormEvent } from 'react'
import { BRAND_NAME, BRAND_TAGLINE, FOOTER_LINKS } from '../../data/content'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!email) return
    // Placeholder — wire up to a real email list provider.
    setSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="w-full bg-surface-container-low pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 lg:col-span-1">
            <div className="font-display text-headline-sm font-bold text-primary">
              {BRAND_NAME}
            </div>
            <p className="max-w-xs font-body text-body-sm text-on-surface-variant">
              {BRAND_TAGLINE}.
            </p>
          </div>

          <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
          <FooterColumn title="Support" links={FOOTER_LINKS.support} />

          <div className="space-y-3">
            <div className="font-display text-label-lg text-on-surface">Stay in the loop</div>
            <p className="font-body text-body-sm text-on-surface-variant">
              Sign up for updates. No spam.
            </p>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="h-10 w-full min-w-0 rounded-lg bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm outline-none placeholder:text-outline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded-lg bg-primary px-4 font-display text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Join
              </button>
            </form>
            <p role="status" className="font-body text-label-sm text-tertiary">
              {submitted ? 'Thanks — you’re on the list.' : ' '}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/60 pt-6 font-body text-body-sm text-on-surface-variant md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {FOOTER_LINKS.legal.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-on-surface">
                {link.label}
              </a>
            ))}
          </div>
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="space-y-3">
      <div className="font-display text-label-lg text-on-surface">{title}</div>
      <ul className="space-y-2 font-body text-body-sm text-on-surface-variant">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition-colors hover:text-on-surface">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
