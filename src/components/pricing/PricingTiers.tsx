
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingTiers = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for small businesses just getting started with digital marketing.",
      monthlyPrice: 999,
      annualPrice: 899,
      features: [
        { included: true, text: "Social Media Management (2 platforms)" },
        { included: true, text: "Basic SEO Optimization" },
        { included: true, text: "Monthly Performance Reports" },
        { included: true, text: "Email Support" },
        { included: false, text: "Content Creation" },
        { included: false, text: "PPC Campaign Management" },
        { included: false, text: "Dedicated Account Manager" },
        { included: false, text: "Advanced Analytics Dashboard" }
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses looking to expand their online presence.",
      monthlyPrice: 1999,
      annualPrice: 1799,
      features: [
        { included: true, text: "Social Media Management (4 platforms)" },
        { included: true, text: "Comprehensive SEO Strategy" },
        { included: true, text: "Weekly Performance Reports" },
        { included: true, text: "Priority Email & Phone Support" },
        { included: true, text: "Content Creation (4 pieces/month)" },
        { included: true, text: "PPC Campaign Management" },
        { included: true, text: "Dedicated Account Manager" },
        { included: false, text: "Advanced Analytics Dashboard" }
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For established businesses requiring a comprehensive digital marketing solution.",
      monthlyPrice: 3999,
      annualPrice: 3599,
      features: [
        { included: true, text: "Social Media Management (All platforms)" },
        { included: true, text: "Advanced SEO Strategy & Implementation" },
        { included: true, text: "Daily Performance Reports" },
        { included: true, text: "24/7 Priority Support" },
        { included: true, text: "Content Creation (10 pieces/month)" },
        { included: true, text: "PPC Campaign Management" },
        { included: true, text: "Dedicated Account Manager" },
        { included: true, text: "Advanced Analytics Dashboard" }
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-full mb-8">
            <button
              onClick={() => setIsAnnual(false)}
              className={`py-2 px-4 rounded-full text-sm md:text-base transition-all ${!isAnnual ? 'bg-white shadow-md text-marketing-dark' : 'text-gray-600'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`py-2 px-4 rounded-full text-sm md:text-base transition-all ${isAnnual ? 'bg-white shadow-md text-marketing-dark' : 'text-gray-600'}`}
            >
              Annual <span className="text-marketing-orange font-semibold">Save 10%</span>
            </button>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-xl shadow-lg p-8 border-2 ${plan.popular ? 'border-marketing-blue' : 'border-gray-100'} relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-marketing-blue text-white py-1 px-4 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6 h-12">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                <span className="text-gray-600">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild
                className={`w-full ${plan.popular ? 'bg-marketing-blue hover:bg-blue-700' : 'bg-marketing-dark hover:bg-gray-800'} text-white`}
              >
                <Link to="/contact">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="max-w-xl mx-auto text-center mt-12 text-gray-600">
          <p>All plans include a 14-day free trial. No credit card required. Cancel anytime.</p>
          <p className="mt-2">Need a custom solution? <Link to="/contact" className="text-marketing-blue hover:underline">Contact us</Link> for a tailored quote.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
