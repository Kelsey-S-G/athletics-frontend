import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AthletesManagement = () => {
  const [athletes, setAthletes] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [athleteForm, setAthleteForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    sport: '',
    position: '',
    yearGroup: '',
    nationality: '',
    image: null
  });

  // Fetch Athletes and Sports
  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const athletesResponse = await fetch("/api/athletes/get_athletes");
      const athletesResult = await athletesResponse.json();
      
      const sportsResponse = await fetch("/api/sports/get_sports");
      const sportsResult = await sportsResponse.json();
      
      if (Array.isArray(athletesResult.athletes)) {
        setAthletes(athletesResult.athletes);
        setSports(sportsResult);
        setError(null);
      } else {
        setError('Failed to fetch athletes');
      }
    } catch (error) {
      console.error('Error fetching athletes:', error);
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAthleteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setAthleteForm(prev => ({
      ...prev,
      image: file
    }));
  };

  // Save athlete (add or update)
  const handleSaveAthlete = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', athleteForm.firstName);
      formData.append('lastName', athleteForm.lastName);
      formData.append('gender', athleteForm.gender);
      formData.append('sport', athleteForm.sport);
      formData.append('position', athleteForm.position);
      formData.append('yearGroup', athleteForm.yearGroup);
      formData.append('nationality', athleteForm.nationality);
      
      if (athleteForm.image) {
        formData.append('image', athleteForm.image);
      }

      // If editing, include the athlete_id
      if (selectedAthlete) {
        formData.append('athlete_id', selectedAthlete.id);
      }

      const response = await fetch("/api/athletes/addOrUpdateAthlete", {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        fetchAthletes(); // Refresh athletes list
        setIsModalOpen(false);
        setSelectedAthlete(null);
        // Reset form
        setAthleteForm({
          firstName: '',
          lastName: '',
          gender: '',
          sport: '',
          position: '',
          yearGroup: '',
          nationality: '',
          image: null
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error saving athlete:', error);
      setError('Unable to save athlete');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/athletes/delete_athlete?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchAthletes(); // Refresh the athletes list
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting athlete:', error);
      setError('Unable to delete athlete');
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  // Modal for Add/Edit Athletes
  const renderAthletesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[60vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            {selectedAthlete ? 'Edit Athlete' : 'Add New Athlete'}
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={athleteForm.firstName}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={athleteForm.lastName}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                placeholder="Enter last name"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Gender</label>
              <select
                name="gender"
                value={athleteForm.gender}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Sport</label>
              <select
                name="sport"
                value={athleteForm.sport}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Sport</option>
                {sports.map(sport => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Position</label>
              <input
                type="text"
                name="position"
                value={athleteForm.position}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                placeholder="Enter position"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Year Group</label>
              <input
                type="text"
                name="yearGroup"
                value={athleteForm.yearGroup}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                placeholder="Enter year group"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={athleteForm.nationality}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                placeholder="Enter nationality"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload}
                accept="image/*"
                className="w-full border p-2 rounded"
              />
            </div>
            
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
        
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setSelectedAthlete(null);
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveAthlete}
              className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  if (loading) return <div>Loading athletes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-800 mb-4">Athletes Management</h2>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-red-800 text-white p-2 rounded mb-4 flex items-center"
      >
        <FaPlus className="mr-2"/> Add Athlete
      </button>

        <table className="w-full border">
          <thead>
            <tr className="bg-red-100">
              <th className="p-2">Name</th>
              <th className="p-2">Sport</th>
              <th className="p-2">Position</th>
              <th className="p-2">Year Group</th>
              <th className="p-2">Nationality</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map(athlete => (
              <tr key={athlete.id} className="border-b">
                <td className="p-2">{athlete.fullName}</td>
                <td className="p-2">{athlete.sport}</td>
                <td className="p-2">{athlete.position}</td>
                <td className="p-2">{athlete.yearGroup}</td>
                <td className="p-2">{athlete.nationality}</td>
                <td className="p-2">
                  {athlete.image && (
                    <img 
                      src={athlete.image} 
                      alt={athlete.fullName} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2 flex space-x-2">
                  <FaEdit 
                    className="text-blue-600 cursor-pointer" 
                    onClick={() => {
                      setSelectedAthlete(athlete);
                      setIsModalOpen(true);
                      setAthleteForm({
                        firstName: athlete.firstName,
                        lastName: athlete.lastName,
                        gender: athlete.gender,
                        sport: athlete.sport,
                        position: athlete.position,
                        yearGroup: athlete.yearGroup,
                        nationality: athlete.nationality,
                        image: null
                      });
                    }}
                  />
                  <FaTrash 
                    className="text-red-600 cursor-pointer" 
                    onClick={() => handleDelete(athlete.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
      {isModalOpen && renderAthletesModal()}
    </div>
  );
};

export default AthletesManagement;
