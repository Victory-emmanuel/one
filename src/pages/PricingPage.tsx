
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import PricingHero from "@/components/pricing/PricingHero";
import PricingTiers from "@/components/pricing/PricingTiers";
import PricingFaq from "@/components/pricing/PricingFaq";
import CtaSection from "@/components/home/CtaSection";

const PricingPage = () => {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PricingHero />
        <PricingTiers />
        <PricingFaq />
        <CtaSection />
      </motion.div>
    </Layout>
  );
};

export default PricingPage;
