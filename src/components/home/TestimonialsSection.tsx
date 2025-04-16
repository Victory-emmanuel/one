
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'CEO, TechStart Inc.',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    text: 'Marketing Lot transformed our online presence. Their SEO strategies increased our organic traffic by 200% in just 6 months. We\'re now ranking on the first page for all our key terms.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Marketing Director, GrowthBrand',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    text: 'The PPC campaigns designed by Marketing Lot delivered a 340% ROI. Their data-driven approach and continuous optimization made all the difference in our digital marketing success.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    position: 'Founder, Boutique Ecommerce',
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
    text: 'Working with Marketing Lot has been a game-changer for our small business. Their social media management has helped us build a loyal community and significantly increased our online sales.',
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-marketing-dark text-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-white/80">
            Don't just take our word for it. Here's what our clients have to say about our services.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-10 -left-10 text-marketing-orange opacity-30">
            <Quote size={80} />
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-marketing-orange">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-lg md:text-xl mb-6 italic">"{testimonials[currentIndex].text}"</p>
                <div>
                  <h4 className="text-xl font-bold">{testimonials[currentIndex].name}</h4>
                  <p className="text-white/70">{testimonials[currentIndex].position}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-marketing-orange scale-125' : 'bg-white/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
