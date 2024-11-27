import { Card, CardContent } from "@/components/ui/card";
import { FaInstagram, FaSnapchat } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState, useEffect } from "react";

export const Sports = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch(`/api/sports/get_sports`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSports(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 h-48 bg-gray-200 rounded-lg"></div>
                <div className="md:w-2/3 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const SportSection = ({ title, sports }) => (
    <div className="w-full lg:w-1/2">
      <h2 className="text-2xl font-black text-red-800 mb-6 uppercase tracking-wider">
        {title}
      </h2>
      <div className="space-y-4">
        {sports.map((sport) => (
          <Card 
            key={sport.id} 
            className="group hover:bg-gray-50 transition-colors"
          >
            <CardContent className="flex justify-between items-center p-4">
              <h3 className="font-bold text-gray-900">{sport.name}</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  {sport?.snap && (
                    <a 
                      href={`https://www.snapchat.com/${sport.snap}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FaSnapchat className="w-5 h-5 text-red-800 hover:text-red-900 cursor-pointer" />
                    </a>
                  )}
                  {sport?.insta && (
                    <a 
                      href={`https://www.instagram.com/${sport.insta}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="w-5 h-5 text-red-800 hover:text-red-900 cursor-pointer" />
                    </a>
                  )}
                  {sport?.x && (
                    <a 
                      href={`https://www.x.com/${sport.x}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FaXTwitter className="w-5 h-5 text-red-800 hover:text-red-900 cursor-pointer" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 bg-gray-200">
      <div className="flex flex-col lg:flex-row gap-12">
        <SportSection title="Women's Sports" sports={sports} />
        <SportSection title="Men's Sports" sports={sports} />
      </div>
    </main>
  );
};

export default Sports;
