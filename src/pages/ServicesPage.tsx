
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ServiceDetail from "@/components/services/ServiceDetail";
import ServicesBanner from "@/components/services/ServicesBanner";
import ServicesGrid from "@/components/services/ServicesGrid";
import ServicesFaq from "@/components/services/ServicesFaq";
import CtaSection from "@/components/home/CtaSection";

const ServicesPage = () => {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ServicesBanner />
        <ServicesGrid />
        <ServiceDetail />
        <ServicesFaq />
        <CtaSection />
      </motion.div>
    </Layout>
  );
};

export default ServicesPage;
