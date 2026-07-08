import { FeatureCards } from '@/components/home/FeatureCards';
import { Hero } from '@/components/home/Hero';
import { PlatformPreview } from '@/components/home/PlatformPreview';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <PlatformPreview />
    </main>
  );
}
