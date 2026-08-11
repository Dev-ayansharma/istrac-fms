import { Link } from 'react-router-dom'
import { useCms } from '../context/cmsContext'
import { type HeroContent } from '../types/cms'
import { Button } from '.'

export function Hero() {
  const { cmsBlocks, isLoading } = useCms()
  const hero = cmsBlocks['hero'] as unknown as HeroContent | undefined

  if (isLoading) {
    return <div className="h-64 bg-slate-50 animate-pulse" />
  }

  return (
    <section className="bg-navy-900 text-white py-20 px-6 text-center">
      <h1 className="text-4xl font-bold font-sans mb-4">
        {hero?.title ?? 'ISTRAC-FMS'}
      </h1>
      <p className="text-slate-100 text-lg mb-8 max-w-xl mx-auto">
        {hero?.subtitle ?? 'Centralized, permission-controlled file management.'}
      </p>
      <Link to="/register">
        <Button variant="secondary" size="lg">
          {hero?.ctaText ?? 'Request Access'}
        </Button>
      </Link>
    </section>
  )
}