import React from "react";
import { Button } from '@/components/ui/button';

const AboutSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Images and Stats */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="flex gap-4">
            <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" alt="Product 1" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-2xl font-bold text-marketing-blue">30,000+</span>
                <span className="text-xs text-gray-500 dark:text-gray-300 mt-1 text-center">Sales in July 2021 with 5 star ratings and happy clients.</span>
                <div className="flex mt-2 -space-x-2">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user1" className="w-6 h-6 rounded-full border-2 border-white" />
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user2" className="w-6 h-6 rounded-full border-2 border-white" />
                  <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="user3" className="w-6 h-6 rounded-full border-2 border-white" />
                  <img src="https://randomuser.me/api/portraits/women/46.jpg" alt="user4" className="w-6 h-6 rounded-full border-2 border-white" />
                  <span className="w-6 h-6 rounded-full bg-marketing-blue text-white flex items-center justify-center text-xs font-semibold border-2 border-white">+5</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Product 2" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-end">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-500 dark:text-gray-300 mb-1">Best ratings</span>
                <div className="flex gap-1">
                  <span role="img" aria-label="angry">😡</span>
                  <span role="img" aria-label="sad">😞</span>
                  <span role="img" aria-label="neutral">😐</span>
                  <span role="img" aria-label="happy">😊</span>
                  <span role="img" aria-label="smile">😁</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-64 h-44 rounded-2xl overflow-hidden shadow-lg mx-auto">
            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="Product 3" className="w-full h-full object-cover" />
          </div>
        </div>
        {/* Right: Text Content */}
        <div className="flex flex-col justify-center items-start px-2 lg:px-8">
          <span className="uppercase tracking-widest text-marketing-blue font-semibold text-xs mb-2">A BIT</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">ABOUT US</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
            From they fine john he give of rich he. They age and draw mrs like. Improving end distrusts may instantly was household applauded incommode. Why kept very ever home mrs. Considered sympathize ten uncommonly occasional assistance sufficient not.
          </p>
          <Button className="btn-primary text-base px-6 py-2 rounded-lg shadow-md">Explore More</Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;