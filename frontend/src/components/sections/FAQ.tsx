import SectionHeading from '../ui/SectionHeading'
import Accordion from '../ui/Accordion'
import { FAQ_ITEMS } from '../../data/content'

export default function FAQ() {
  return (
    <section id="faq" className="w-full bg-surface-container-low py-16 lg:py-24">
      <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          title="Common questions"
          description="Answers below are placeholders — replace with confirmed details before launch."
        />
        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  )
}
