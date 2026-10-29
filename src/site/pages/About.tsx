import { useSite } from '../lib'
import { PageHeader, TourImage } from '../ui'
import { Closing, Faq, Reviews } from './Home'

export default function About() {
  const { t, content } = useSite()
  const about = content.blocks.about
  const travellers = content.blocks.hero?.travellers
  // A photo from the tours until the team photo is added in the admin.
  const photo = content.tours.find((tour) => tour.slug === 'personalised-tours')?.images[0] ?? content.tours.find((tour) => tour.images[0])?.images[0]

  return (
    <>
      <PageHeader title={t.aboutTitle} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-8 md:grid-cols-2 md:items-center md:pt-12">
        <section className="space-y-4">
          {about?.title && <h2 className="font-serif text-[28px] font-bold leading-tight md:text-4xl">{about.title}</h2>}
          {(about?.paragraphs ?? []).map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-relaxed text-slate-700 md:text-base">
              {paragraph}
            </p>
          ))}
          {travellers && (
            <p className="flex items-baseline gap-2 pt-2">
              <span className="font-serif text-4xl font-bold text-teal-700">{travellers}</span>
              <span className="text-slate-600">{t.happyTravellers}</span>
            </p>
          )}
        </section>
        <TourImage image={photo} className="h-72 w-full rounded-3xl md:h-[420px]" sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <Reviews compact />
      <Faq />
      <Closing />
    </>
  )
}
