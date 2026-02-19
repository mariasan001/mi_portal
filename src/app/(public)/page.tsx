import Hero from '@/features/site/Components/Hero/Hero';
import ServicesSection from '@/features/site/Components/ServicesSection/ServicesSection';
import ConvocatoriasSection from '@/features/site/Components/ConvocatoriasSection/ConvocatoriasSection';

export default function PublicHomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
        <ConvocatoriasSection />
    </>
  );
}
