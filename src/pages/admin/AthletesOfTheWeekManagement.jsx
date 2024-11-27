import React, { useState, useEffect } from 'react';
import { FaSave, FaTrophy } from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const AthletesOfTheWeekManagement = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch("/api/athletes/get_athletes");
        const data = await response.json();
        
        if (data.status === 'success') {
          setAthletes(data.athletes);
          setLoading(false);
        } else {
          toast.error('Failed to fetch athletes');
          setLoading(false);
        }
      } catch (error) {
        toast.error('Error connecting to the server');
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  // Handle athlete selection
  const toggleAthleteSelection = (athlete) => {
    setSelectedAthletes(prev => {
      // If already selected, remove
      if (prev.some(a => a.id === athlete.id)) {
        return prev.filter(a => a.id !== athlete.id);
      }
      
      // If less than 2 athletes selected, add
      if (prev.length < 2) {
        return [...prev, athlete];
      }
      
      // If already 2 selected, replace the first one
      return [prev[1], athlete];
    });
  };

  // Submit selected athletes
  const handleSubmit = async () => {
    if (selectedAthletes.length !== 2) {
      toast.error('Please select exactly 2 athletes');
      return;
    }

    try {
      const response = await fetch("/api/athletes/set_athletes_of_week", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          athleteIds: selectedAthletes.map(a => a.id)
        })
      });
      const result = await response.json();

      if (result.status === 'success') {
        alert('Athletes of the Week updated successfully')
        toast.success('Athletes of the Week updated successfully');
      } else {
        toast.error(result.message || 'Failed to update Athletes of the Week');
      }
    } catch (error) {
      toast.error('Error submitting athletes');
    }
  };

  if (loading) {
    return <div>Loading athletes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <FaTrophy className="text-red-800 text-3xl" />
        <h1 className="text-2xl font-bold text-gray-900">Athletes of the Week</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map(athlete => (
          <Card 
            key={athlete.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedAthletes.some(a => a.id === athlete.id) 
                ? 'border-4 border-red-800 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => toggleAthleteSelection(athlete)}
          >
            <div className="relative">
              <img 
                src={athlete.image || '/placeholder-athlete.png'}
                alt={`${athlete.firstName} ${athlete.lastName}`}
                className="w-full h-64 object-cover"
              />
              {selectedAthletes.some(a => a.id === athlete.id) && (
                <div className="absolute top-2 right-2 bg-red-800 text-white p-2 rounded-full">
                  Selected
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold">
                {athlete.firstName} {athlete.lastName}
              </h2>
              <p className="text-gray-600">{athlete.sport}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSubmit}
          disabled={selectedAthletes.length !== 2}
          className="bg-red-800 text-white px-6 py-3 rounded-lg 
            flex items-center space-x-2 
            hover:bg-red-700 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSave />
          <span>Set Athletes of the Week</span>
        </button>
      </div>

      {selectedAthletes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Selected Athletes:</h2>
          <div className="flex space-x-4">
            {selectedAthletes.map(athlete => (
              <div key={athlete.id} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                <img 
                  src={athlete.image || '/placeholder-athlete.png'} 
                  alt={`${athlete.firstName} ${athlete.lastName}`} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span>{athlete.firstName} {athlete.lastName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AthletesOfTheWeekManagement;
