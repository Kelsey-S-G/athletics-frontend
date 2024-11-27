import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventsForm, setEventsForm] = useState({
    name: '',
    sport_id: '',
    location: '',
    date: '',
    time: '',
    details: '',
    result: ''
  });

  // Fetch Sports for Dropdown
  const fetchSports = async () => {
    try {
      const response = await fetch("/api/sports/get_sports");
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setSports(result);
      } else {
        setError('Failed to fetch sports');
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
      setError('Unable to connect to the server');
    }
  };

  // Fetch Events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events/get_events");
      const result = await response.json();
      
      if (result.status === 'success') {
        setEvents(result.events);
        setError(null);
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save events (add or update)
  const handleSaveEvents = async () => {
    try {
      const formData = new FormData();
      Object.keys(eventsForm).forEach(key => {
        formData.append(key, eventsForm[key]);
      });

      // If editing, include the event_id
      if (selectedItem) {
        formData.append('event_id', selectedItem.id);
      }

      const response = await fetch("/api/events/addOrUpdateEvent", {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        fetchEvents(); // Refresh events list
        setIsModalOpen(false);
        setSelectedItem(null);
        // Reset form
        setEventsForm({
          name: '',
          sport_id: '',
          location: '',
          date: '',
          time: '',
          details: '',
          result: ''
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Unable to save event');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/events/delete_event?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchEvents(); // Refresh the events list
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Unable to delete event');
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchSports();
  }, []);

  // Modal for Add/Edit Events
  const renderEventsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
      <div className="bg-white p-8 rounded w-1/2 max-h-[70vh] overflow-y-auto">
        <h2 className="text-xl mb-4">
          {selectedItem ? 'Edit Event' : 'Add New Event'}
        </h2>
        
        <div className="mb-4">
          <label className="block mb-2">Event Name</label>
          <input
            type="text"
            name="name"
            value={eventsForm.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter event name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Sport</label>
          <select
            name="sport_id"
            value={eventsForm.sport_id}
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
        
        <div className="mb-4">
          <label className="block mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={eventsForm.location}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter event location"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={eventsForm.date}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={eventsForm.time}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Details</label>
          <textarea
            name="details"
            value={eventsForm.details}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter event details"
            rows="4"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Result</label>
          <input
            type="text"
            name="result"
            value={eventsForm.result}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter event result"
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
            onClick={handleSaveEvents}
            className="bg-red-800 text-white p-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-800 mb-4">Events Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-red-800 text-white p-2 rounded mb-4 flex items-center"
        >
          <FaPlus className="mr-2"/> Add Event
        </button>
        <table className="w-full border">
          <thead>
            <tr className="bg-red-100">
              <th className="p-2">Name</th>
              <th className="p-2">Sport</th>
              <th className="p-2">Location</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Details</th>
              <th className="p-2">Result</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.sport}</td>
                <td className="p-2">{item.location}</td>
                <td className="p-2">{item.date}</td>
                <td className="p-2">{item.time}</td>
                <td className="p-2">{item.details}</td>
                <td className="p-2">{item.result}</td>
                <td className="p-2 flex space-x-2">
                  <FaEdit 
                    className="text-blue-600 cursor-pointer" 
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                      setEventsForm({
                        name: item.name,
                        sport_id: sports.find(sport => sport.sport_name === item.sport)?.sport_id || '',
                        location: item.location,
                        date: item.date,
                        time: item.time,
                        details: item.details,
                        result: item.result
                      });
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
      
      {isModalOpen && renderEventsModal()}
    </div>
  );
};

export default EventsManagement;
