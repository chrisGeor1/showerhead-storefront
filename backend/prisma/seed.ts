import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/modules/auth/auth.service.js'
import { env } from '../src/env.js'
import { initStorage, storageAdapter } from '../src/storage/storage-adapter.factory.js'

const prisma = new PrismaClient()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND_PUBLIC_DIR = path.resolve(__dirname, '../../frontend/public')

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
}

/** Reads a file out of the frontend's public/ dir and stores it through the
 *  real StorageAdapter, so seeded media is indistinguishable from an
 *  admin upload. Idempotent — upserts on the media's storage key. */
async function seedMedia(relativePath: string, key: string) {
  const absPath = path.join(FRONTEND_PUBLIC_DIR, relativePath)
  const buffer = await fs.readFile(absPath)
  const ext = path.extname(relativePath).toLowerCase()
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream'

  const existing = await prisma.media.findUnique({ where: { key } })
  if (existing) return existing

  const result = await storageAdapter.upload({ key, buffer, contentType })
  return prisma.media.create({
    data: {
      key: result.key,
      url: result.url,
      mimeType: contentType,
      kind: contentType.startsWith('video/') ? 'VIDEO' : 'IMAGE',
      sizeBytes: buffer.byteLength,
    },
  })
}

async function main() {
  console.log('Seeding — this uploads the real product photos/video through the storage adapter, so it can take a minute for the lattice video.')

  await initStorage()

  // --- Admin user ---
  const passwordHash = await hashPassword(env.ADMIN_SEED_PASSWORD)
  await prisma.adminUser.upsert({
    where: { email: env.ADMIN_SEED_EMAIL },
    update: {},
    create: { email: env.ADMIN_SEED_EMAIL, passwordHash },
  })
  console.log(`Admin user ready: ${env.ADMIN_SEED_EMAIL} / ${env.ADMIN_SEED_PASSWORD}`)

  // --- Media ---
  const media = {
    latticeFront: await seedMedia('images/lattice-front.png', 'seed/lattice-front.png'),
    latticeSide: await seedMedia('images/lattice-side.png', 'seed/lattice-side.png'),
    latticeMounted: await seedMedia('images/lattice-mounted.png', 'seed/lattice-mounted.png'),
    latticeSprayActive: await seedMedia('images/lattice-spray-active.png', 'seed/lattice-spray-active.png'),
    latticeSprayCloseup: await seedMedia('images/lattice-spray-closeup.png', 'seed/lattice-spray-closeup.png'),
    latticeSprayWide: await seedMedia('images/lattice-spray-wide.png', 'seed/lattice-spray-wide.png'),
    latticeVideo: await seedMedia('video/product-demo-lattice.mp4', 'seed/product-demo-lattice.mp4'),

    whiteAndBlack: await seedMedia('images/white-and-black-variants.png', 'seed/white-and-black-variants.png'),
    whiteStudio: await seedMedia('images/white-studio-shot.png', 'seed/white-studio-shot.png'),
    threadedEnd: await seedMedia('images/threaded-end-in-hand.png', 'seed/threaded-end-in-hand.png'),
    sprayDemoAction: await seedMedia('images/spray-demo-action.png', 'seed/spray-demo-action.png'),
    sprayInHandBoth: await seedMedia('images/spray-in-hand-both-finishes.png', 'seed/spray-in-hand-both-finishes.png'),
    spiralVideo: await seedMedia('video/product-demo-spiral.mp4', 'seed/product-demo-spiral.mp4'),
  }
  console.log(`Uploaded ${Object.keys(media).length} media files.`)

  // --- Variants ---
  await prisma.variant.upsert({
    where: { id: 'lattice' },
    update: {},
    create: {
      id: 'lattice',
      label: 'Lattice Cage — Blue',
      swatch: '#1d6fe0',
      productName: 'Open Lattice Cage Showerhead',
      productSummary: 'Open lattice body, flexible hose connection, circular multi-jet spray face.',
      price: 100.0, // seed placeholder — set the real price in the admin dashboard
      currency: 'NGN',
      active: true,
      sortOrder: 0,
      heroEyebrow: 'Open-Lattice Design',
      heroHeadline: 'A shower fixture built like sculpture.',
      heroSubhead:
        'An open lattice body wraps a circular multi-jet spray face, built to attach to your existing flexible hose. Shown here in our own bathroom — not a stock photo.',
      heroImageId: media.latticeFront.id,
      heroImageAlt: 'Bright blue open-lattice handheld showerhead held in a hand, connected to a flexible hose',
      heroSecondaryImageId: media.latticeSprayActive.id,
      heroSecondaryImageAlt: 'Close-up of the circular multi-jet spray face with water actively spraying',
      features: {
        create: [
          {
            title: 'Open Lattice Body',
            description:
              'The housing is built from an open, woven lattice rather than a solid shell — an intentionally sculptural, see-through structure you hold directly in your hand.',
            imageId: media.latticeSide.id,
            imageAlt: 'Side view of the open lattice body of the handheld showerhead',
            sortOrder: 0,
          },
          {
            title: 'Circular Multi-Jet Spray Face',
            description:
              'Water exits through a ring of jets arranged around a circular face, producing a full, radial spray pattern.',
            imageId: media.latticeSprayCloseup.id,
            imageAlt: 'Close-up of the circular spray face showing the ring of jets while active',
            sortOrder: 1,
          },
          {
            title: 'Flexible Hose Connection',
            description:
              'Connects to a flexible hose so it can be held and aimed by hand, separate from a fixed overhead shower arm.',
            imageId: media.latticeMounted.id,
            imageAlt: 'The showerhead held near an overhead fixture, flexible hose visible below',
            sortOrder: 2,
          },
        ],
      },
      gallery: {
        create: [
          {
            kind: 'VIDEO',
            mediaId: media.latticeVideo.id,
            posterMediaId: media.latticeSprayWide.id,
            alt: 'Video demo of the open lattice cage showerhead spraying water',
            caption: 'Product demo — Lattice Cage',
            sortOrder: 0,
          },
          {
            kind: 'IMAGE',
            mediaId: media.latticeFront.id,
            alt: 'Bright blue open-lattice handheld showerhead held in a hand',
            caption: 'Lattice body, front view',
            sortOrder: 1,
          },
          {
            kind: 'IMAGE',
            mediaId: media.latticeSide.id,
            alt: 'Side view of the open lattice body connected to a dark flexible hose',
            caption: 'Lattice body, side view',
            sortOrder: 2,
          },
          {
            kind: 'IMAGE',
            mediaId: media.latticeSprayActive.id,
            alt: 'Close-up of the circular spray face with water actively spraying, held near an overhead fixture',
            caption: 'Multi-jet spray face, active',
            sortOrder: 3,
          },
          {
            kind: 'IMAGE',
            mediaId: media.latticeSprayCloseup.id,
            alt: 'Close-up of the circular spray face aimed downward with water spraying',
            caption: 'Spray face, close-up',
            sortOrder: 4,
          },
          {
            kind: 'IMAGE',
            mediaId: media.latticeSprayWide.id,
            alt: 'Wide shot of the spray face dispersing water in a broad pattern',
            caption: 'Spray pattern, wide view',
            sortOrder: 5,
          },
          {
            kind: 'IMAGE',
            mediaId: media.latticeMounted.id,
            alt: 'The showerhead held up near a fixed overhead shower fixture',
            caption: 'In the shower',
            sortOrder: 6,
          },
        ],
      },
    },
  })

  await prisma.variant.upsert({
    where: { id: 'spiral' },
    update: {},
    create: {
      id: 'spiral',
      label: 'Spiral Jet — White/Black',
      swatch: '#1f2430',
      productName: 'Spiral Jet Showerhead Attachment',
      productSummary: 'Spiral-ridged housing, threaded connection, available in white or black.',
      price: 100.0, // seed placeholder — set the real price in the admin dashboard
      currency: 'NGN',
      active: true,
      sortOrder: 1,
      heroEyebrow: 'Spiral-Ridged Design',
      heroHeadline: 'A compact upgrade for your existing shower.',
      heroSubhead:
        'A small, threaded spiral-jet nozzle attachment with a ribbed housing, available in white or black. Shown here from our own product photos — not stock imagery.',
      heroImageId: media.whiteAndBlack.id,
      heroImageAlt: 'Spiral jet showerhead attachment shown in both white and black finishes side by side',
      heroSecondaryImageId: media.sprayDemoAction.id,
      heroSecondaryImageAlt: 'The spiral jet nozzle attachment spraying water while held in a hand',
      features: {
        create: [
          {
            title: 'Spiral-Ridged Housing',
            description:
              'The cylindrical body has a spiral-grooved surface molded into the housing, giving it a distinct ribbed grip and look.',
            imageId: media.whiteStudio.id,
            imageAlt: 'Studio shot of the white spiral-ridged nozzle housing',
            sortOrder: 0,
          },
          {
            title: 'Threaded Attachment',
            description:
              'Connects via a threaded end, sized to attach directly to a standard shower arm or hose fitting.',
            imageId: media.threadedEnd.id,
            imageAlt: 'The nozzle held in a hand near a bathroom fixture, showing the threaded connection end',
            sortOrder: 1,
          },
          {
            title: 'Two Finish Options',
            description: 'Available in white or black to match different bathroom fixtures.',
            imageId: media.whiteAndBlack.id,
            imageAlt: 'White and black versions of the nozzle shown side by side',
            sortOrder: 2,
          },
        ],
      },
      gallery: {
        create: [
          {
            kind: 'VIDEO',
            mediaId: media.spiralVideo.id,
            posterMediaId: media.sprayDemoAction.id,
            alt: 'Video demo of the spiral jet nozzle attachment spraying water',
            caption: 'Product demo — Spiral Jet',
            sortOrder: 0,
          },
          {
            kind: 'IMAGE',
            mediaId: media.whiteAndBlack.id,
            alt: 'White and black versions of the spiral jet nozzle shown side by side',
            caption: 'White and black finishes',
            sortOrder: 1,
          },
          {
            kind: 'IMAGE',
            mediaId: media.whiteStudio.id,
            alt: 'Studio shot of the white spiral-ridged nozzle housing',
            caption: 'White finish, studio view',
            sortOrder: 2,
          },
          {
            kind: 'IMAGE',
            mediaId: media.threadedEnd.id,
            alt: 'The nozzle held in a hand near a bathroom fixture, showing the threaded connection end and its dimensions',
            caption: 'Threaded end, in hand',
            sortOrder: 3,
          },
          {
            kind: 'IMAGE',
            mediaId: media.sprayDemoAction.id,
            alt: 'The nozzle attachment spraying water in use',
            caption: 'In use',
            sortOrder: 4,
          },
          {
            kind: 'IMAGE',
            mediaId: media.sprayInHandBoth.id,
            alt: 'The nozzle attachment spraying water over a hand, with both white and black finishes visible',
            caption: 'In use, both finishes',
            sortOrder: 5,
          },
        ],
      },
    },
  })
  console.log('Seeded 2 variants (lattice, spiral).')

  // --- FAQ ---
  const faqItems = [
    {
      question: 'Will this fit my existing shower hose or arm?',
      answer:
        'Compatibility depends on the style and your fitting size. [Placeholder — add confirmed thread size / adapter details per style here.]',
    },
    { question: 'How do I install it?', answer: '[Placeholder — add installation steps here once finalized.]' },
    { question: 'What is it made of?', answer: '[Placeholder — add verified material details here.]' },
    { question: 'How do I clean and care for it?', answer: '[Placeholder — add care instructions here.]' },
    {
      question: 'What are your shipping and returns policies?',
      answer: '[Placeholder — add shipping and returns policy here.]',
    },
    { question: 'Is it covered by a warranty?', answer: '[Placeholder — add warranty terms here, if any.]' },
  ]
  await prisma.faqItem.deleteMany({})
  await prisma.faqItem.createMany({
    data: faqItems.map((item, index) => ({ ...item, sortOrder: index })),
  })
  console.log(`Seeded ${faqItems.length} FAQ items.`)

  // --- Site settings ---
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      brandName: 'VORTEX',
      brandTagline: 'Shower Spray Attachments',
      navLinks: [
        { label: 'Features', href: '#features' },
        { label: 'Gallery', href: '#gallery' },
        { label: 'Shop', href: '#purchase' },
        { label: 'FAQ', href: '#faq' },
      ],
      footerLinks: {
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
      },
    },
  })
  console.log('Seeded site settings.')

  console.log('\nDone. Log into the admin dashboard with:')
  console.log(`  email:    ${env.ADMIN_SEED_EMAIL}`)
  console.log(`  password: ${env.ADMIN_SEED_PASSWORD}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
