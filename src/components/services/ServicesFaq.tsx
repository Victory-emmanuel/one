
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it take to see results from SEO?",
    answer: "SEO is a long-term strategy, typically taking 3-6 months to see significant results. However, this varies based on your industry, competition, current website condition, and the strategies implemented. We provide monthly reports to track progress and show improvements in rankings, traffic, and conversions."
  },
  {
    question: "Do you guarantee first page rankings?",
    answer: "We don't guarantee specific rankings as search engines constantly evolve their algorithms. However, we implement proven strategies and best practices to improve your visibility. Our focus is on driving relevant traffic that converts, rather than vanity metrics like rankings for low-value keywords."
  },
  {
    question: "How do you measure the success of digital marketing campaigns?",
    answer: "We establish clear KPIs aligned with your business goals, which may include website traffic, conversion rates, lead generation, revenue growth, or ROI. We use tools like Google Analytics, custom dashboards, and regular reporting to track performance and make data-driven optimizations."
  },
  {
    question: "Do you require long-term contracts?",
    answer: "While digital marketing strategies typically work best over time, we offer flexible contract options. We have month-to-month arrangements, 3-month, 6-month, and annual contracts. Longer commitments often include preferred pricing and additional services."
  },
  {
    question: "How much do your services cost?",
    answer: "Our pricing varies based on your specific needs, goals, and the scope of work required. We offer customized packages rather than a one-size-fits-all approach. After understanding your business objectives, we'll provide a detailed proposal outlining our recommended strategies and associated investment."
  },
  {
    question: "How often will we receive reports on our campaign performance?",
    answer: "We provide comprehensive monthly reports detailing performance metrics, insights, and recommendations. These reports are accompanied by strategy calls to discuss results and next steps. For certain campaigns, we also offer real-time dashboards for continuous monitoring."
  }
];

const ServicesFaq = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    setExpandedItems(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  return (
    <section className="py-20 bg-gray-50" id="services-faq">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700">
            Find answers to common questions about our digital marketing services.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesFaq;
