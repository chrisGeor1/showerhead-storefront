# VORTEX — Shower Spray Attachments Storefront

A React + TypeScript + Tailwind CSS storefront presenting **two real, physically different
products** as selectable styles of one line:

- **Lattice Cage — Blue**: an open-lattice handheld showerhead with a circular multi-jet
  spray face, on a flexible hose.
- **Spiral Jet — White/Black**: a compact spiral-ridged nozzle attachment with a threaded
  connection, in white or black.

A style switcher (in the Hero and again in the Purchase section) swaps the headline, hero
photos, feature cards, and gallery to match the selected product — see §3.

**History:** this started from an uploaded Stitch export (`AQUAFLOW | Turbo Cage Shower
Head`) for the Lattice Cage product. That was later fully swapped for the Spiral Jet photos,
then both were merged back together into the current two-style structure. The Stitch
export's **design system** (colors, typography, spacing rhythm, card/button/nav patterns)
was kept throughout; its **marketing copy** (invented pressure/GPM claims, certifications,
fake reviews, pricing tiers) was not — see §4.

## 1. Project structure

```
showerhead-storefront/
├── index.html                  # Document shell, fonts, meta
├── public/
│   ├── favicon.svg             # Simple placeholder mark (no logo was uploaded)
│   ├── images/
│   │   ├── lattice-front.png              ┐
│   │   ├── lattice-side.png                │ Lattice Cage (Blue) photos
│   │   ├── lattice-mounted.png             │ — real phone photos
│   │   ├── lattice-spray-active.png        │
│   │   ├── lattice-spray-closeup.png       │
│   │   └── lattice-spray-wide.png         ┘
│   │   ├── white-and-black-variants.png   ┐
│   │   ├── white-studio-shot.png           │ Spiral Jet (White/Black) photos
│   │   └── threaded-end-in-hand.png        │ — supplier/listing-style photos
│   │   └── spray-demo-action.png          ┘
│   └── video/
│       ├── product-demo-lattice.mp4    # Lattice Cage demo clip
│       └── product-demo-spiral.mp4     # Spiral Jet demo clip (~7s)
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Providers + assembles the page from sections
│   ├── index.css                # Tailwind import + design tokens (@theme) + base styles
│   ├── types.ts                 # Shared TypeScript types, incl. ProductVariant
│   ├── data/
│   │   └── content.ts           # ALL editable copy: brand name, nav, VARIANTS array
│   │                             # (hero/features/gallery per style), FAQ, footer links
│   ├── context/
│   │   ├── CartContext.tsx      # Minimal cart item-count state, shared via context
│   │   └── VariantContext.tsx   # Selected product style, shared via context
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx       # Sticky nav, mobile menu, cart badge
│       │   └── Footer.tsx       # Footer links + newsletter form (UI only, not wired up)
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Accordion.tsx    # Accessible FAQ accordion
│       │   ├── SectionHeading.tsx
│       │   └── StyleSwitcher.tsx # The Lattice Cage / Spiral Jet picker
│       └── sections/
│           ├── Hero.tsx         # Reads the selected variant + hosts a StyleSwitcher
│           ├── Features.tsx     # Tabbed 3-card layout, per variant
│           ├── Gallery.tsx      # Image/video gallery, per variant
│           ├── Purchase.tsx     # Per-variant title/image + editable price + Add to Cart
│           └── FAQ.tsx          # Shared across both styles
└── vite.config.ts                # Tailwind v4 wired in via @tailwindcss/vite (no tailwind.config.js)
```

## 2. Setup — run it locally

Requires Node 18+.

```bash
cd showerhead-storefront
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # Type-checks (tsc -b) and builds a production bundle to dist/
npm run preview   # Serves the production build locally
npm run lint       # Runs oxlint
```

## 3. How the style switcher works

`src/context/VariantContext.tsx` holds the currently selected `ProductVariant` (see
`src/types.ts`) and exposes it via `useVariant()`. `Hero`, `Features`, `Gallery`, and
`Purchase` all call that hook and render whatever the active variant contains — so adding a
third style is just adding a third entry to the `VARIANTS` array in `src/data/content.ts`;
no component changes needed. `<StyleSwitcher />` (in `src/components/ui/`) is the picker UI;
it's rendered twice (Hero + Purchase) and both instances stay in sync since they share the
same context.

The cart badge, price, and quantity are **not** per-variant — there's one shared cart count
and one shared editable price field regardless of which style is selected. If the two
products should have different prices, that'll need small changes to `Purchase.tsx` (move
`price`/`quantity` state into the variant, or track it in a map keyed by variant id).

## 4. Editing content

Almost everything text-based lives in **`src/data/content.ts`**: `BRAND_NAME`, nav links,
the `VARIANTS` array (each with its own hero copy, 3 features, and gallery items), FAQ
questions/answers, and footer links. Edit that one file for most copy changes.

The **price** is intentionally a live-editable input in the Purchase section rather than
hardcoded — no real price has been provided, so it defaults to `0` with a note.

## 5. What's real vs. placeholder

**Real, from your uploads:**
- All 10 product photos (6 Lattice Cage + 4 Spiral Jet) in `public/images/`, and both demo
  videos in `public/video/`
- The original Stitch export's color palette, type scale, spacing rhythm, and layout
  patterns (sticky header, hero mosaic, tabbed feature cards, rounded buttons/cards)

**A note on the two photo sets, since they're visibly different quality:**
- The **Lattice Cage** photos are full-resolution phone photos/video frames of the physical
  product in a real shower.
- The **Spiral Jet** photos are 220×220px and have the visual style of supplier/listing
  photography (studio cutouts, baked-in dimension callouts) rather than original
  photography — they'll look soft scaled up in the hero. Two other images from that same
  upload batch were **excluded entirely** because they had marketing text burned into the
  pixels ("The strength of the water flow is related to the water pressure" and a "Spiral
  jet showerhead" label) — that's the kind of invented pressure claim the brief said to
  avoid.
- If you have higher-resolution Spiral Jet originals, swap them into `public/images/`
  (same filenames, or update the paths in the `spiral` entry of `VARIANTS` in `content.ts`).

**Placeholder — needs your input before this is launch-ready:**
- **Brand name** — `VORTEX` is a placeholder (`BRAND_NAME` in `content.ts`).
- **Favicon / logo** — a plain generated mark; no logo file was uploaded.
- **Whether these are really "one product line, two styles"** — worth double-checking. They
  were merged into a single style-switcher UI at your direction, but they're genuinely
  different physical designs (open cage vs. threaded cylinder), not a color option of the
  same part. If they're actually meant to be two separate, independently-listed products,
  this single-page-with-a-switcher structure isn't the right shape and each would want its
  own page/URL instead.
- **Price** — defaults to `$0.00`, shared across both styles (see §3).
- **FAQ answers** — every answer is a bracketed placeholder (fit/compatibility, install
  steps, materials, care, shipping/returns, warranty). None of these were confirmed, and the
  brief asked not to invent technical/compatibility/warranty claims.
- **Add to Cart / checkout** — cart state (item count, shown in the header badge) is real,
  local React state. There's no real checkout flow, payment processing, or backend.
- **Newsletter signup** — the footer form is UI-only; it doesn't send anywhere yet.
- **Certifications, reviews, pricing tiers, precise technical/pressure specs** —
  deliberately left out, per the brief.

## 6. Notes

- Built with Tailwind CSS v4 (CSS-first config via `@theme` in `src/index.css`, applied
  through the `@tailwindcss/vite` plugin) — there's no `tailwind.config.js`.
- The dimension callouts visible in `threaded-end-in-hand.png` (6.5cm/2.55in diameter,
  0.78in thread, 8cm/3.14in height) are the only baked-in image text kept, since they read
  as factual measurements rather than a performance/marketing claim — verify they're
  accurate before relying on them.
- `product-demo-lattice.mp4` is ~22 MB, uncompressed. Fine for local dev; consider
  compressing (H.264, target well under 10 MB) before deploying to production.
