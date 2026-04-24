import {
  AppDownloadSection,
  ConvocatoriasSection,
  DudasSection,
  GuidesSection,
  Hero,
  PortalAssistant,
  QuickAccessSection,
  ServicesSection,
} from '@/features/site';

export default function PublicHomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <ConvocatoriasSection />
      <GuidesSection />
      <QuickAccessSection />
      <DudasSection />
      <AppDownloadSection />
      <PortalAssistant />
    </>
  );
}
