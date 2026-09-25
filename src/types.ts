export interface NavLink {
  label: string
  href: string
}

export interface GalleryItem {
  id: string
  kind: 'image' | 'video'
  src: string
  poster?: string
  alt: string
  caption: string
}

export interface FeatureItem {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface ProductVariant {
  id: string
  label: string
  swatch: string
  productName: string
  productSummary: string
  hero: {
    eyebrow: string
    headline: string
    subhead: string
    heroImage: { src: string; alt: string }
    secondaryImage: { src: string; alt: string }
  }
  features: FeatureItem[]
  gallery: GalleryItem[]
}
