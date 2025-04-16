
import { TrendingUp, Users, Award, Globe } from 'lucide-react';

const stats = [
  {
    icon: <TrendingUp className="h-10 w-10 text-marketing-blue" />,
    value: '250%',
    label: 'Average ROI',
  },
  {
    icon: <Users className="h-10 w-10 text-marketing-blue" />,
    value: '100+',
    label: 'Happy Clients',
  },
  {
    icon: <Award className="h-10 w-10 text-marketing-blue" />,
    value: '15+',
    label: 'Industry Awards',
  },
  {
    icon: <Globe className="h-10 w-10 text-marketing-blue" />,
    value: '24/7',
    label: 'Global Support',
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-marketing-blue to-blue-700 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="bg-white/10 p-4 rounded-full inline-block mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
