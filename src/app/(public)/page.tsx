import Hero from '@/features/site/Components/Hero/Hero';
import ServicesSection from '@/features/site/Components/ServicesSection/ServicesSection';
import ConvocatoriasSection from '@/features/site/Components/ConvocatoriasSection/ConvocatoriasSection';
import GuidesSection from '@/features/site/Components/GuidesSection/GuidesSection';
import QuickAccessSection from '@/features/site/Components/QuickAccessSection/QuickAccessSection';
import DudasSection from '@/features/site/Components/DudasSection/DudasSection';
import AppDownloadSection from '@/features/site/Components/AppDownloadSection/AppDownloadSection';

export default function PublicHomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
        <ConvocatoriasSection />
        <GuidesSection/>
        <QuickAccessSection/>
        <DudasSection/>
        <AppDownloadSection/>
    </>
  );
}
