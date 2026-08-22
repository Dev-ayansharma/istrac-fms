import {
  Navbar,
  AnnouncementBar,
  Hero,
  FeatureStrip,
  Gallery,
  Banner,
  AboutSection,
  ContactSection,
  Footer,
} from '../components'

export function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-page text-text-primary">
      <Navbar />
      <AnnouncementBar />
      <main>
        <Hero />
        <FeatureStrip />
        <Gallery />
        <Banner />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
