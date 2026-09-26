import type { FaqItem, NavLink, ProductVariant } from '../types'

/**
 * BRAND is a placeholder — no brand name was provided in the uploaded media.
 * Swap this for the real name.
 */
export const BRAND_NAME = 'VORTEX'
export const BRAND_TAGLINE = 'Shower Spray Attachments'

export const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Shop', href: '#purchase' },
  { label: 'FAQ', href: '#faq' },
]

/**
 * Two real, physically different products from your uploads, presented as
 * selectable styles of one line. Whoever picks up this project should
 * double check that's the right framing — they're genuinely different
 * designs (open lattice cage vs. a spiral-ridged cylinder), not just a
 * color option of the same part.
 */
export const VARIANTS: ProductVariant[] = [
  {
    id: 'spiral',
    label: 'Spiral Jet — White/Black',
    swatch: '#1f2430',
    productName: 'Spiral Jet Showerhead Attachment',
    productSummary: 'Spiral-ridged housing, threaded connection, available in white or black.',
    hero: {
      eyebrow: 'Spiral-Ridged Design',
      headline: 'A compact upgrade for your existing shower.',
      subhead:
        'A small, threaded spiral-jet nozzle attachment with a ribbed housing, available in white or black. Shown here from our own product photos — not stock imagery.',
      heroImage: {
        src: '/images/white-and-black-variants.png',
        alt: 'Spiral jet showerhead attachment shown in both white and black finishes side by side',
      },
      secondaryImage: {
        src: '/images/spray-demo-action.png',
        alt: 'The spiral jet nozzle attachment spraying water while held in a hand',
      },
    },
    features: [
      {
        id: 'spiral-housing',
        title: 'Spiral-Ridged Housing',
        description:
          'The cylindrical body has a spiral-grooved surface molded into the housing, giving it a distinct ribbed grip and look.',
        image: '/images/white-studio-shot.png',
        imageAlt: 'Studio shot of the white spiral-ridged nozzle housing',
      },
      {
        id: 'threaded-connection',
        title: 'Threaded Attachment',
        description:
          'Connects via a threaded end, sized to attach directly to a standard shower arm or hose fitting.',
        image: '/images/threaded-end-in-hand.png',
        imageAlt: 'The nozzle held in a hand near a bathroom fixture, showing the threaded connection end',
      },
      {
        id: 'two-finishes',
        title: 'Two Finish Options',
        description: 'Available in white or black to match different bathroom fixtures.',
        image: '/images/white-and-black-variants.png',
        imageAlt: 'White and black versions of the nozzle shown side by side',
      },
    ],
    gallery: [
      {
        id: 'spiral-video',
        kind: 'video',
        src: '/video/product-demo-spiral.mp4',
        poster: '/images/spray-demo-action.png',
        alt: 'Video demo of the spiral jet nozzle attachment spraying water',
        caption: 'Product demo — Spiral Jet',
      },
      {
        id: 'spiral-g1',
        kind: 'image',
        src: '/images/white-and-black-variants.png',
        alt: 'White and black versions of the spiral jet nozzle shown side by side',
        caption: 'White and black finishes',
      },
      {
        id: 'spiral-g2',
        kind: 'image',
        src: '/images/white-studio-shot.png',
        alt: 'Studio shot of the white spiral-ridged nozzle housing',
        caption: 'White finish, studio view',
      },
      {
        id: 'spiral-g3',
        kind: 'image',
        src: '/images/threaded-end-in-hand.png',
        alt: 'The nozzle held in a hand near a bathroom fixture, showing the threaded connection end and its dimensions',
        caption: 'Threaded end, in hand',
      },
      {
        id: 'spiral-g4',
        kind: 'image',
        src: '/images/spray-demo-action.png',
        alt: 'The nozzle attachment spraying water in use',
        caption: 'In use',
      },
      {
        id: 'spiral-g5',
        kind: 'image',
        src: '/images/spray-in-hand-both-finishes.png',
        alt: 'The nozzle attachment spraying water over a hand, with both white and black finishes visible',
        caption: 'In use, both finishes',
      },
    ],
  },
  {
    id: 'lattice',
    label: 'Lattice Cage — Blue',
    swatch: '#1d6fe0',
    productName: 'Open Lattice Cage Showerhead',
    productSummary: 'Open lattice body, flexible hose connection, circular multi-jet spray face.',
    hero: {
      eyebrow: 'Open-Lattice Design',
      headline: 'A shower fixture built like sculpture.',
      subhead:
        'An open lattice body wraps a circular multi-jet spray face, built to attach to your existing flexible hose. Shown here in our own bathroom — not a stock photo.',
      heroImage: {
        src: '/images/lattice-front.png',
        alt: 'Bright blue open-lattice handheld showerhead held in a hand, connected to a flexible hose',
      },
      secondaryImage: {
        src: '/images/lattice-spray-active.png',
        alt: 'Close-up of the circular multi-jet spray face with water actively spraying',
      },
    },
    features: [
      {
        id: 'lattice-body',
        title: 'Open Lattice Body',
        description:
          'The housing is built from an open, woven lattice rather than a solid shell — an intentionally sculptural, see-through structure you hold directly in your hand.',
        image: '/images/lattice-side.png',
        imageAlt: 'Side view of the open lattice body of the handheld showerhead',
      },
      {
        id: 'multi-jet-face',
        title: 'Circular Multi-Jet Spray Face',
        description:
          'Water exits through a ring of jets arranged around a circular face, producing a full, radial spray pattern.',
        image: '/images/lattice-spray-closeup.png',
        imageAlt: 'Close-up of the circular spray face showing the ring of jets while active',
      },
      {
        id: 'flexible-hose',
        title: 'Flexible Hose Connection',
        description:
          'Connects to a flexible hose so it can be held and aimed by hand, separate from a fixed overhead shower arm.',
        image: '/images/lattice-mounted.png',
        imageAlt: 'The showerhead held near an overhead fixture, flexible hose visible below',
      },
    ],
    gallery: [
      {
        id: 'lattice-video',
        kind: 'video',
        src: '/video/product-demo-lattice.mp4',
        poster: '/images/lattice-spray-wide.png',
        alt: 'Video demo of the open lattice cage showerhead spraying water',
        caption: 'Product demo — Lattice Cage',
      },
      {
        id: 'lattice-g1',
        kind: 'image',
        src: '/images/lattice-front.png',
        alt: 'Bright blue open-lattice handheld showerhead held in a hand',
        caption: 'Lattice body, front view',
      },
      {
        id: 'lattice-g2',
        kind: 'image',
        src: '/images/lattice-side.png',
        alt: 'Side view of the open lattice body connected to a dark flexible hose',
        caption: 'Lattice body, side view',
      },
      {
        id: 'lattice-g3',
        kind: 'image',
        src: '/images/lattice-spray-active.png',
        alt: 'Close-up of the circular spray face with water actively spraying, held near an overhead fixture',
        caption: 'Multi-jet spray face, active',
      },
      {
        id: 'lattice-g4',
        kind: 'image',
        src: '/images/lattice-spray-closeup.png',
        alt: 'Close-up of the circular spray face aimed downward with water spraying',
        caption: 'Spray face, close-up',
      },
      {
        id: 'lattice-g5',
        kind: 'image',
        src: '/images/lattice-spray-wide.png',
        alt: 'Wide shot of the spray face dispersing water in a broad pattern',
        caption: 'Spray pattern, wide view',
      },
      {
        id: 'lattice-g6',
        kind: 'image',
        src: '/images/lattice-mounted.png',
        alt: 'The showerhead held up near a fixed overhead shower fixture',
        caption: 'In the shower',
      },
    ],
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-fit',
    question: 'Will this fit my existing shower hose or arm?',
    answer:
      'Compatibility depends on the style and your fitting size. [Placeholder — add confirmed thread size / adapter details per style here.]',
  },
  {
    id: 'faq-install',
    question: 'How do I install it?',
    answer: '[Placeholder — add installation steps here once finalized.]',
  },
  {
    id: 'faq-material',
    question: 'What is it made of?',
    answer: '[Placeholder — add verified material details here.]',
  },
  {
    id: 'faq-care',
    question: 'How do I clean and care for it?',
    answer: '[Placeholder — add care instructions here.]',
  },
  {
    id: 'faq-shipping',
    question: 'What are your shipping and returns policies?',
    answer: '[Placeholder — add shipping and returns policy here.]',
  },
  {
    id: 'faq-warranty',
    question: 'Is it covered by a warranty?',
    answer: '[Placeholder — add warranty terms here, if any.]',
  },
]

export const FOOTER_LINKS = {
  shop: [
    { label: 'Shop', href: '#purchase' },
    { label: 'Features', href: '#features' },
    { label: 'Gallery', href: '#gallery' },
  ],
  support: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#' },
    { label: 'Shipping & Returns', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}
