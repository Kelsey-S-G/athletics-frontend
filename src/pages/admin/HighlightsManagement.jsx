import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const HighlightsManagement = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightsForm, setHighlightsForm] = useState({
    title: '',
    date: '',
    link: '',
    image: null
  });

  // Fetch Highlights
  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/highlights/get_highlights");
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setHighlights(result);
        setError(null);
      } else {
        setError('Failed to fetch highlights');
      }
    } catch (error) {
      console.error('Error fetching highlights:', error);
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHighlightsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setHighlightsForm(prev => ({
      ...prev,
      image: file
    }));
  };

  // Save highlights (add or update)
  const handleSaveHighlights = async () => {
    try {
      const formData = new FormData();
      formData.append('title', highlightsForm.title);
      formData.append('date', highlightsForm.date);
      formData.append('link', highlightsForm.link);
      
      if (highlightsForm.image) {
        formData.append('image', highlightsForm.image);
      }

      // If editing, include the highlight_id
      if (selectedItem) {
        formData.append('highlight_id', selectedItem.id);
      }

      const response = await fetch("/api/highlights/addOrUpdateHighlight", {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        fetchHighlights(); // Refresh highlights list
        setIsModalOpen(false);
        setSelectedItem(null);
        // Reset form
        setHighlightsForm({
          title: '',
          date: '',
          link: '',
          image: null
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error saving highlight:', error);
      setError('Unable to save highlight');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/highlights/delete_highlight?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchHighlights(); // Refresh the highlights list
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Unable to delete highlight');
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  // Modal for Add/Edit Highlights
  const renderHighlightsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded w-1/2">
        <h2 className="text-xl mb-4">
          {selectedItem ? 'Edit Highlight' : 'Add New Highlight'}
        </h2>
        
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={highlightsForm.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={highlightsForm.date}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Link</label>
          <input
            type="url"
            name="link"
            value={highlightsForm.link}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter video/media link"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full border p-2 rounded"
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
            onClick={handleSaveHighlights}
            className="bg-red-800 text-white p-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading highlights...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-800 mb-4">Highlights Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-red-800 text-white p-2 rounded mb-4 flex items-center"
        >
          <FaPlus className="mr-2"/> Add Highlight
        </button>
        <table className="w-full border">
          <thead>
            <tr className="bg-red-100">
              <th className="p-2">Title</th>
              <th className="p-2">Date</th>
              <th className="p-2">Link</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {highlights.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.date}</td>
                <td className="p-2">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    View Link
                  </a>
                </td>
                <td className="p-2">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2 flex space-x-2">
                  <FaEdit 
                    className="text-blue-600 cursor-pointer" 
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                      setHighlightsForm({
                        title: item.title,
                        date: item.date,
                        link: item.link,
                        image: null
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
      
      {isModalOpen && renderHighlightsModal()}
    </div>
  );
};

export default HighlightsManagement;
