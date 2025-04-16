
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
