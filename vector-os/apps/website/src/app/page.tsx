import { CinematicHero } from '@/components/home/CinematicHero';
import { PackagingStory } from '@/components/home/PackagingStory';
import { QualityStory } from '@/components/home/QualityStory';
import { ResearchSeries } from '@/components/home/ResearchSeries';

export default function HomePage() {
  return (
    <main className="cinematic-page">
      <CinematicHero />
      <ResearchSeries />
      <PackagingStory />
      <QualityStory />
    </main>
  );
}
