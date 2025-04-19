
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactMap from "@/components/contact/ContactMap";

const ContactPage = () => {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ContactHero />
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              <div className="lg:col-span-2">
                <ContactForm />
              </div>
              <div>
                <ContactInfo />
              </div>
            </div>
          </div>
        </div>
        <ContactMap />
      </motion.div>
    </Layout>
  );
};

export default ContactPage;
