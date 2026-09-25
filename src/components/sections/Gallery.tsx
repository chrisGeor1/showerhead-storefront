import { useState } from 'react'
import SectionHeading from '../ui/SectionHeading'
import { useVariant } from '../../context/VariantContext'
import type { GalleryItem } from '../../types'

export default function Gallery() {
  const { variant } = useVariant()
  const items = variant.gallery
  const [activeItem, setActiveItem] = useState<GalleryItem>(items[0])
  const [seenVariantId, setSeenVariantId] = useState(variant.id)

  if (seenVariantId !== variant.id) {
    setSeenVariantId(variant.id)
    setActiveItem(items[0])
  }

  return (
    <section id="gallery" className="w-full bg-surface-container-low py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={`Gallery — ${variant.label}`}
          title="See it in the shower"
          description="Real photos and video of the actual product — no stock imagery."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-lg lg:col-span-8">
            <div className="aspect-video w-full bg-on-surface">
              {activeItem.kind === 'video' ? (
                <video
                  key={activeItem.id}
                  controls
                  poster={activeItem.poster}
                  className="h-full w-full object-contain"
                  aria-label={activeItem.alt}
                >
                  <source src={activeItem.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={activeItem.src}
                  alt={activeItem.alt}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <p className="px-5 py-3 font-body text-body-sm text-on-surface-variant">
              {activeItem.caption}
            </p>
          </div>

          <div
            className="grid grid-cols-4 gap-3 lg:col-span-4 lg:grid-cols-3"
            role="group"
            aria-label="Gallery thumbnails"
          >
            {items.map((item) => {
              const isActive = item.id === activeItem.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  aria-pressed={isActive}
                  aria-label={item.kind === 'video' ? `Play video: ${item.caption}` : item.caption}
                  className={`group relative aspect-square overflow-hidden rounded-xl bg-surface-container-high shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive ? 'ring-2 ring-primary' : 'hover:opacity-90'
                  }`}
                >
                  <img
                    src={item.kind === 'video' ? item.poster : item.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {item.kind === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-on-surface/30">
                      <PlayGlyph />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6 drop-shadow" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.14z" />
    </svg>
  )
}
