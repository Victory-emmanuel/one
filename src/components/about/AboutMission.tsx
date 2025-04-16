
import { motion } from "framer-motion";

const AboutMission = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlYW0lMjBtZWV0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" 
              alt="Our team collaborating" 
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission & Vision</h2>
            
            <div>
              <h3 className="text-xl font-bold text-marketing-blue mb-2">Mission</h3>
              <p className="text-lg text-gray-700">
                To empower businesses with innovative digital marketing solutions that drive measurable growth, enhance brand visibility, and create meaningful connections with their audience.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-marketing-blue mb-2">Vision</h3>
              <p className="text-lg text-gray-700">
                To become the most trusted digital marketing partner for businesses worldwide, known for our transparency, results-driven approach, and commitment to excellence.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-marketing-blue mb-2">Values</h3>
              <ul className="text-lg text-gray-700 space-y-2">
                <li><span className="font-semibold">Innovation:</span> Constantly exploring new strategies and technologies</li>
                <li><span className="font-semibold">Integrity:</span> Transparent and honest in all our dealings</li>
                <li><span className="font-semibold">Results:</span> Focused on delivering measurable outcomes</li>
                <li><span className="font-semibold">Collaboration:</span> Working as an extension of your team</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
