
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new rate will be prorated for the remainder of your billing cycle. If you downgrade, the new rate will take effect at the start of your next billing cycle."
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No long-term contracts required. Our services are available on a month-to-month basis, though we offer discounts for annual commitments. You can cancel at any time with 30 days' notice."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) as well as PayPal and bank transfers for annual plans."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for new customers. If you're not satisfied with our services within the first 14 days, we'll provide a full refund, no questions asked."
  },
  {
    question: "What's included in the onboarding process?",
    answer: "Our onboarding process includes an initial strategy call, account setup, tool integration, access to our client portal, and a comprehensive marketing audit to establish benchmarks and define goals."
  },
  {
    question: "Can I pause my service temporarily?",
    answer: "Yes, you can pause your service for up to 3 months per year. During this period, your account will remain active, but services will be suspended, and you won't be charged."
  }
];

const PricingFaq = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Find answers to common questions about our pricing and plans.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center mt-12"
        >
          <p className="text-lg dark:text-white">
            Still have questions? Contact our team at{" "}
            <a href="mailto:info@marketinglot.com" className="text-marketing-blue dark:text-blue-400 hover:underline">
              info@marketinglot.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingFaq;
