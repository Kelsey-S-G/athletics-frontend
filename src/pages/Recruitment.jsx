import React, { useState, useEffect } from "react";
import { Trophy, Users, ClipboardCheck, Medal, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Recruitment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleStartApplication = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate("/recruit-form");
    }
  };

  const LoginPrompt = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Login Required</h2>
        <p className="mb-6">Please log in to start your recruitment application.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowLoginPrompt(false)}
            className="px-4 py-2 border border-red-800 text-red-800 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          Join Our Athletic Program
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take your athletic career to the next level. We're looking for
          dedicated athletes who want to compete at the collegiate level while
          pursuing academic excellence.
        </p>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Trophy className="w-12 h-12 text-red-800 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Championship Titles</h3>
          <p className="text-3xl font-bold text-red-800">25+</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Users className="w-12 h-12 text-red-800 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Student Athletes</h3>
          <p className="text-3xl font-bold text-red-800">300+</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Medal className="w-12 h-12 text-red-800 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All-Americans</h3>
          <p className="text-3xl font-bold text-red-800">50+</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto text-center">
        <div className="bg-red-800 text-white rounded-lg p-8">
          <Star className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Take the first step towards your collegiate athletic career. Fill
            out our recruitment form and our coaches will review your
            application.
          </p>
          <button
            className="bg-white text-red-800 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            onClick={handleStartApplication}
          >
            Start Application
            <ClipboardCheck className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
      {showLoginPrompt && <LoginPrompt />}
    </div>
  );
};

export default Recruitment;
