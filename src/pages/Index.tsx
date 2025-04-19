
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
// import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import CtaSection from '@/components/home/CtaSection';
import ValuePropositionSection from '@/components/home/ValuePropositionSection';
import IndustrySolutionsSection from '@/components/services/IndustrySolutionsSection';
import AboutSection from '@/components/home/AboutSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
     
      <ServicesSection />
      <ValuePropositionSection/>
  <IndustrySolutionsSection/>
      {/* <TestimonialsSection /> */}
      <AboutSection />
      <BlogPreviewSection />
      <CtaSection />
      
    </Layout>
  );
};

export default Index;
