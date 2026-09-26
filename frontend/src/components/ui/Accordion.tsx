import { useState, type KeyboardEvent } from 'react'
import type { FaqItem } from '../../types'

interface AccordionProps {
  items: FaqItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle(id)
    }
  }

  return (
    <div className="divide-y divide-outline-variant rounded-2xl border border-outline-variant bg-surface-container-lowest">
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `faq-panel-${item.id}`
        const buttonId = `faq-button-${item.id}`

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => handleKeyDown(event, item.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-headline-sm text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-2xl leading-none text-primary transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 font-body text-body-md text-on-surface-variant">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
