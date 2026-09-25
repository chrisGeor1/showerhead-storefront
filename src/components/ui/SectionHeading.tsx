interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl space-y-2 ${alignment}`}>
      {eyebrow && (
        <span className="font-display text-label-sm font-bold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-headline-lg text-on-surface sm:text-headline-xl">
        {title}
      </h2>
      {description && (
        <p className="font-body text-body-md text-on-surface-variant">{description}</p>
      )}
    </div>
  )
}
