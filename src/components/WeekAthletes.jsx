import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, ArrowRight } from "lucide-react";

const WeekAthletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAthletesOfTheWeek = async () => {
      try {
        const response = await fetch("/api/athletes/get_athletes_of_week");
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setAthletes(data.athletesOfTheWeek);
        } else {
          throw new Error(data.message || 'Failed to fetch athletes of the week');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletesOfTheWeek();
  }, []);

  if (loading) {
    return (
      <section className="relative py-16 bg-cover bg-center bg-[url('/athletesWeek.jpg')] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-red-900/90" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Athletes of the Week
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-full sm:w-[300px] animate-pulse">
                <div className="bg-white/10 rounded-xl overflow-hidden">
                  <div className="aspect-square bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-16 bg-cover bg-center bg-[url('/athletesWeek.jpg')] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-red-900/90" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="bg-red-600/20 p-8 rounded-xl">
            <h2 className="text-2xl text-white mb-4">Error Loading Athletes</h2>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 bg-cover bg-center bg-[url('/athletesWeek.jpg')] overflow-hidden">
      {/* Background Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-red-900/90" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Athletes of the Week
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Recognizing exceptional performance and dedication in our athletic
            program
          </p>
        </motion.div>

        {/* Centered Athletes Cards */}
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
          {athletes.map((athlete, index) => (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group w-full sm:w-[300px]"
            >
              {/* Athlete Card */}
              <div
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden 
                            border border-white/20 hover:border-red-500/50 transition-all 
                            duration-300 shadow-xl h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={athlete.image || '/default-athlete.jpg'}
                    alt={athlete.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 
                             group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Sport Badge */}
                  <div
                    className="absolute top-4 right-4 bg-red-900/90 text-white px-4 py-1 
                                rounded-full text-sm font-medium backdrop-blur-sm"
                  >
                    {athlete.sport}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2 text-center">
                    {athlete.fullName}
                  </h2>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Trophy size={16} />
                      <span>{athlete.achievements.length > 0 ? athlete.achievements[0] : "MVP"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Medal size={16} />
                      <span>{athlete.yearGroup ? `Year : ${athlete.yearGroup}` : "Senior"}</span>
                    </div>
                  </div>

                  {/* Achievements/Description */}
                  <p className="text-gray-400 mb-4 text-center line-clamp-3">
                    {athlete.achievements.length > 0 
                      ? athlete.achievements.join(", ") 
                      : "Outstanding performance in recent games and competitions."}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeekAthletes;
