
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import AboutHero from "@/components/about/AboutHero";
import AboutMission from "@/components/about/AboutMission";
import AboutTeam from "@/components/about/AboutTeam";
import AboutTimeline from "@/components/about/AboutTimeline";
import CtaSection from "@/components/home/CtaSection";

const AboutPage = () => {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AboutHero />
        <AboutMission />
        <AboutTeam />
        <AboutTimeline />
        <CtaSection />
      </motion.div>
    </Layout>
  );
};

export default AboutPage;
