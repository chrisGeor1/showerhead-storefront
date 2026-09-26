import type { Feature, GalleryItem, Media, Variant } from '@prisma/client'

type VariantWithRelations = Variant & {
  heroImage: Media
  heroSecondaryImage: Media
  features: (Feature & { image: Media })[]
  gallery: (GalleryItem & { media: Media; posterMedia: Media | null })[]
}

export function presentVariant(variant: VariantWithRelations) {
  return {
    id: variant.id,
    label: variant.label,
    swatch: variant.swatch,
    productName: variant.productName,
    productSummary: variant.productSummary,
    price: Number(variant.price),
    currency: variant.currency,
    active: variant.active,
    sortOrder: variant.sortOrder,
    hero: {
      eyebrow: variant.heroEyebrow,
      headline: variant.heroHeadline,
      subhead: variant.heroSubhead,
      heroImage: { src: variant.heroImage.url, alt: variant.heroImageAlt },
      secondaryImage: { src: variant.heroSecondaryImage.url, alt: variant.heroSecondaryImageAlt },
    },
    features: variant.features
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        image: f.image.url,
        imageAlt: f.imageAlt,
        sortOrder: f.sortOrder,
      })),
    gallery: variant.gallery
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((g) => ({
        id: g.id,
        kind: g.kind.toLowerCase() as 'image' | 'video',
        src: g.media.url,
        poster: g.posterMedia?.url,
        alt: g.alt,
        caption: g.caption,
        sortOrder: g.sortOrder,
      })),
  }
}

export const variantInclude = {
  heroImage: true,
  heroSecondaryImage: true,
  features: { include: { image: true } },
  gallery: { include: { media: true, posterMedia: true } },
} as const
