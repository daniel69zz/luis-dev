import { site } from '@/config/site';
import { About } from './home/About';
import { Certifications } from './home/Certifications';
import { Contact } from './home/Contact';
import { FeaturedProjects } from './home/FeaturedProjects';
import { Hero } from './home/Hero';
import { Stack } from './home/Stack';

export function HomePage() {
  return (
    <>
      <title>{`${site.name} — ${site.role}`}</title>
      <Hero />
      <About />
      <FeaturedProjects />
      <Stack />
      <Certifications />
      <Contact />
    </>
  );
}
