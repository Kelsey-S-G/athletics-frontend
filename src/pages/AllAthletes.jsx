import React, { useState, useEffect } from "react";
import { Search, Filter, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const AthleteList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch athletes data from the backend
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch("/api/athletes/get_athletes");
        const data = await response.json();
        
        if (data.status === 'success') {
          setAthletes(data.athletes);
          // Extract unique sports from the athletes data
          const uniqueSports = [...new Set(data.athletes.map(athlete => athlete.sport))];
          setSports(uniqueSports);
        } else {
          setError('Failed to fetch athletes data');
        }
      } catch (err) {
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch = (athlete.firstName + ' ' + athlete.lastName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport ? athlete.sport === selectedSport : true;
    return matchesSearch && matchesSport;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading athletes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 bg-gray-200">
      <div className="mb-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search athletes..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <select
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none appearance-none bg-white"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">All Sports</option>
              {sports.map((sport, index) => (
                <option key={index} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.map((athlete) => (
          <Card
            key={athlete.id}
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative">
              <img
                src={athlete.image || '/placeholder-athlete.png'} // Fallback to placeholder if no image
                alt={`${athlete.firstName} ${athlete.lastName}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-800/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-red-800 uppercase tracking-wider">
                  {athlete.sport}
                </p>
                <h2 className="text-xl font-bold text-gray-900">
                  {athlete.firstName} {athlete.lastName}
                </h2>
                <p className="text-gray-600">{athlete.position}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Year: {athlete.yearGroup}</p>
                <p className="text-gray-600">
                  Nationality: {athlete.nationality}
                </p>
              </div>
              {/* Achievements Section */}
              {athlete.achievements && athlete.achievements.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Medal className="h-5 w-5 text-red-800" />
                    <h3 className="text-md font-semibold text-gray-800">Achievements</h3>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {athlete.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAthletes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No athletes match your search criteria.
          </p>
        </div>
      )}
    </main>
  );
};

export default AthleteList;
