
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real application, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. We'll get back to you shortly.",
        duration: 5000,
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Send Us a Message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+1 (123) 456-7890"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company Name
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your Company Ltd."
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Message *
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Please describe your project or inquiry..."
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="privacy"
            type="checkbox"
            required
            className="h-4 w-4 text-marketing-blue border-gray-300 dark:border-gray-600 rounded focus:ring-marketing-blue"
          />
          <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            I agree to the <a href="#" className="text-marketing-blue hover:underline">Privacy Policy</a> and consent to being contacted regarding my inquiry.
          </label>
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full md:w-auto bg-marketing-blue hover:bg-blue-700 text-white px-8 py-3"
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting ? (
              "Sending..."
            ) : isSubmitted ? (
              <span className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" /> Message Sent
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-5 w-5" /> Send Message
              </span>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
