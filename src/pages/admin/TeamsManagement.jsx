import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const TeamsManagement = () => {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    team_name: '',
    sport_id: '',
    team_email: '',
    coach_name: ''
  });

  // Fetch Teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recruit/get_teams");
      const result = await response.json();
      
      if (!result.error) {
        setTeams(result || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sports for dropdown
  const fetchSports = async () => {
    try {
      const response = await fetch("/api/sports/get_sports");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setSports(result);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save team (add or update)
  const handleSaveTeam = async () => {
    try {
      // If editing, include the team_id
      const payload = selectedItem 
        ? { ...teamForm, team_id: selectedItem.id }
        : teamForm;

      const response = await fetch("/api/teams/addOrUpdateTeam", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        fetchTeams(); // Refresh teams list
        setIsModalOpen(false);
        setSelectedItem(null);
        // Reset form
        setTeamForm({
          team_name: '',
          sport_id: '',
          team_email: '',
          coach_name: ''
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error saving team:', error);
      setError('Unable to save team');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/teams/delete_team?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchTeams(); // Refresh the teams list
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Unable to delete team');
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchSports();
  }, []);

  // Modal for Add/Edit Team
  const renderTeamModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded w-1/2">
        <h2 className="text-xl mb-4">
          {selectedItem ? 'Edit Team' : 'Add New Team'}
        </h2>
        
        <div className="mb-4">
          <label className="block mb-2">Team Name</label>
          <input
            type="text"
            name="team_name"
            value={teamForm.team_name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter team name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Sport</label>
          <select
            name="sport_id"
            value={teamForm.sport_id}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Sport</option>
            {sports.map(sport => (
              <option key={sport.sport_id || sport.id} value={sport.sport_id || sport.id}>
                {sport.sport_name || sport.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Team Email</label>
          <input
            type="email"
            name="team_email"
            value={teamForm.team_email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter team email"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Coach Name</label>
          <input
            type="text"
            name="coach_name"
            value={teamForm.coach_name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter coach name"
          />
        </div>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
            className="bg-gray-300 p-2 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveTeam}
            className="bg-red-800 text-white p-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-800 mb-4">Teams Management</h2>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-red-800 text-white p-2 rounded mb-4 flex items-center"
      >
        <FaPlus className="mr-2"/> Add Team
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-red-100">
            <th className="p-2">Team Name</th>
            <th className="p-2">Sport</th>
            <th className="p-2">Email</th>
            <th className="p-2">Coach</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(item => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.sportName}</td>
              <td className="p-2">{item.team_email || 'N/A'}</td>
              <td className="p-2">{item.coach_name || 'N/A'}</td>
              <td className="p-2 flex space-x-2">
                <FaEdit 
                  className="text-blue-600 cursor-pointer" 
                  onClick={() => {
                    setSelectedItem(item);
                    setTeamForm({
                      team_name: item.name,
                      sport_id: item.sportId,
                      team_email: item.team_email || '',
                      coach_name: item.coach_name || ''
                    });
                    setIsModalOpen(true);
                  }}
                />
                <FaTrash 
                  className="text-red-600 cursor-pointer" 
                  onClick={() => handleDelete(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {isModalOpen && renderTeamModal()}
    </div>
  );
};

export default TeamsManagement;
