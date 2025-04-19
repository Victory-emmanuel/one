
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Sarah Johnson",
    position: "CEO & Founder",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    bio: "With over 15 years of experience in digital marketing, Sarah leads our agency with strategic vision and hands-on expertise.",
    socials: {
      linkedin: "#",
      twitter: "#",
      email: "sarah@marketinglot.com"
    }
  },
  {
    name: "Michael Chen",
    position: "Director of SEO",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    bio: "Michael specializes in technical SEO and has helped numerous clients achieve first-page rankings for competitive keywords.",
    socials: {
      linkedin: "#",
      twitter: "#",
      email: "michael@marketinglot.com"
    }
  },
  {
    name: "Emily Rodriguez",
    position: "Social Media Strategist",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    bio: "Emily crafts engaging social media campaigns that build communities and drive meaningful engagement for our clients.",
    socials: {
      linkedin: "#",
      twitter: "#",
      email: "emily@marketinglot.com"
    }
  },
  {
    name: "David Williams",
    position: "PPC Specialist",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "David is an expert in creating high-converting paid advertising campaigns across Google, Facebook, and LinkedIn.",
    socials: {
      linkedin: "#",
      twitter: "#",
      email: "david@marketinglot.com"
    }
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const AboutTeam = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Meet Our Team</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Our team of experts is dedicated to helping your business succeed in the digital landscape.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={item}>
              <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 dark:text-white">{member.name}</h3>
                  <p className="text-marketing-blue dark:text-blue-400 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{member.bio}</p>
                  <div className="flex space-x-4">
                    <a href={member.socials.linkedin} className="text-gray-600 dark:text-gray-400 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
                      <Linkedin size={20} />
                    </a>
                    <a href={member.socials.twitter} className="text-gray-600 dark:text-gray-400 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
                      <Twitter size={20} />
                    </a>
                    <a href={`mailto:${member.socials.email}`} className="text-gray-600 dark:text-gray-400 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTeam;
