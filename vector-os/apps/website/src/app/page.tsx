import { CinematicHero } from '@/components/home/CinematicHero';
import { PurchaseCta } from '@/components/home/PurchaseCta';
import { QualityStory } from '@/components/home/QualityStory';
import { ResearchSeries } from '@/components/home/ResearchSeries';
import { PackagingExperience } from '@/components/effects/PackagingExperience';
import { TrustMarquee } from '@/components/effects/TrustMarquee';

export default function HomePage() {
  return (
    <main className="cinematic-page">
      <CinematicHero />
      <TrustMarquee />
      <ResearchSeries />
      <PackagingExperience />
      <QualityStory />
      <PurchaseCta />
    </main>
  );
}
