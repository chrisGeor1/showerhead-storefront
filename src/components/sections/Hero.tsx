import Button from '../ui/Button'
import StyleSwitcher from '../ui/StyleSwitcher'
import { useVariant } from '../../context/VariantContext'

export default function Hero() {
  const { variant } = useVariant()
  const { hero } = variant

  return (
    <section id="top" className="relative w-full overflow-hidden pb-16 pt-8 lg:pb-24 lg:pt-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div key={variant.id} className="animate-fade-up flex flex-col items-start gap-6 lg:col-span-6">
          <StyleSwitcher />

          <span className="font-display text-label-sm font-bold uppercase tracking-widest text-primary">
            {hero.eyebrow}
          </span>

          <h1 className="font-display text-display-hero-mobile text-on-surface sm:text-display-hero">
            {hero.headline}
          </h1>

          <p className="max-w-xl font-body text-body-lg text-on-surface-variant">
            {hero.subhead}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={() =>
                document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Shop Now
              <ArrowIcon />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <PlayIcon />
              Watch It In Action
            </Button>
          </div>
        </div>

        <div key={`${variant.id}-visual`} className="relative animate-fade-up lg:col-span-6">
          <div className="relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center sm:aspect-[4/5]">
            <div className="absolute inset-0 -rotate-2 scale-95 rounded-3xl bg-gradient-to-tr from-primary-fixed-dim/50 via-tertiary-fixed/40 to-surface-container-high blur-xl" />

            <div className="group relative z-10 h-[85%] w-3/5 overflow-hidden rounded-3xl bg-surface-container-lowest shadow-2xl">
              <img
                src={hero.heroImage.src}
                alt={hero.heroImage.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="group absolute right-0 top-[8%] z-20 h-[65%] w-1/2 overflow-hidden rounded-3xl bg-surface-container-lowest shadow-2xl transition-transform hover:-translate-y-1">
              <img
                src={hero.secondaryImage.src}
                alt={hero.secondaryImage.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-primary" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.14z" />
    </svg>
  )
}
