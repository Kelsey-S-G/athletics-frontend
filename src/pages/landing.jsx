import React from "react";
import { motion } from "framer-motion";
import Carousel from "../components/Carousel";
import MainFeed from "../components/MainFeed";
import WeekAthletes from "../components/WeekAthletes";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <Carousel />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-100 to-transparent" />
      </section>

      {/* Quick Stats Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white py-6 shadow-md"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Athletes", value: "500+" },
              { label: "Sports Teams", value: "32" },
              { label: "Championships", value: "45" },
              { label: "Facilities", value: "12" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-4"
              >
                <div className="text-3xl font-bold text-red-900">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        <MainFeed />
      </motion.div>

      {/* Athletes of the Week Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <WeekAthletes />
      </motion.div>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-red-900 text-white py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Athletic Community
          </h2>
          <p className="mb-8 text-lg">
            Stay updated with the latest news, events, and achievements
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Subscribe to Updates
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
