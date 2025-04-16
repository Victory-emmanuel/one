
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const milestones = [
  {
    year: "2018",
    title: "Agency Founded",
    description: "Marketing Lot was established with a mission to deliver data-driven digital marketing solutions."
  },
  {
    year: "2019",
    title: "First Major Client",
    description: "Secured our first enterprise client and delivered a 200% ROI on their digital marketing campaigns."
  },
  {
    year: "2020",
    title: "Team Expansion",
    description: "Grew our team to 10 full-time digital marketing specialists and expanded our service offerings."
  },
  {
    year: "2021",
    title: "Industry Recognition",
    description: "Received multiple industry awards for our innovative campaigns and exceptional client results."
  },
  {
    year: "2022",
    title: "International Expansion",
    description: "Opened our first international office and began serving clients across Europe and Asia."
  },
  {
    year: "2023",
    title: "Proprietary Technology",
    description: "Launched our proprietary marketing analytics platform to better serve our growing client base."
  },
  {
    year: "2024",
    title: "AI Integration",
    description: "Integrated advanced AI and machine learning capabilities into our marketing strategies."
  },
  {
    year: "2025",
    title: "Current State",
    description: "Now serving over 100 clients globally with a team of 30+ digital marketing experts."
  }
];

const AboutTimeline = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-lg text-gray-700">
            The evolution of Marketing Lot from a small startup to a global digital marketing agency.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-marketing-blue/20 hidden md:block"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center gap-8`}
              >
                <div className="md:w-1/2 flex md:justify-end">
                  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${index % 2 === 0 ? 'border-marketing-orange' : 'border-marketing-blue'} max-w-md`}>
                    <div className="flex items-center mb-2">
                      <div className={`text-xl font-bold text-white px-3 py-1 rounded mr-3 ${index % 2 === 0 ? 'bg-marketing-orange' : 'bg-marketing-blue'}`}>
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="relative md:w-0">
                  <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-marketing-blue z-10">
                    <CheckCircle2 className="h-5 w-5 text-marketing-blue" />
                  </div>
                </div>
                
                <div className="md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;
