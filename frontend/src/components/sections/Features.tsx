import { useState } from 'react'
import SectionHeading from '../ui/SectionHeading'
import { useVariant } from '../../context/VariantContext'

export default function Features() {
  const { variant } = useVariant()
  const features = variant.features
  const [activeId, setActiveId] = useState(features[0].id)
  const [seenVariantId, setSeenVariantId] = useState(variant.id)

  if (seenVariantId !== variant.id) {
    setSeenVariantId(variant.id)
    setActiveId(features[0].id)
  }

  const activeIndex = features.findIndex((feature) => feature.id === activeId)

  return (
    <section id="features" className="w-full bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={`Product Design — ${variant.label}`}
            title="Built around three visible features"
            description="Three things distinguish this style, all visible directly on the product itself."
          />

          <div
            role="tablist"
            aria-label="Product features"
            className="flex w-fit items-center gap-1 self-start rounded-full bg-surface-container-low p-1.5 md:self-auto"
          >
            {features.map((feature) => (
              <button
                key={feature.id}
                role="tab"
                id={`feature-tab-${feature.id}`}
                aria-selected={activeId === feature.id}
                aria-controls={`feature-panel-${feature.id}`}
                onClick={() => setActiveId(feature.id)}
                className={`rounded-full px-4 py-2 font-display text-label-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  activeId === feature.id
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.id}
              id={`feature-panel-${feature.id}`}
              role="tabpanel"
              aria-labelledby={`feature-tab-${feature.id}`}
              className={`group flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-md transition-all hover:shadow-xl ${
                activeIndex === index ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-surface-container-high">
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <span className="font-display text-label-sm font-bold text-primary">
                  Feature 0{index + 1}
                </span>
                <h3 className="font-display text-headline-md text-on-surface">{feature.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
