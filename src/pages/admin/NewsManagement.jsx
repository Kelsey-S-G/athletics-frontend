import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({
    headline: '',
    sport_id: '',
  });

  // Fetch News
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news/get_news");
      const result = await response.json();
      
      if (result.status === 'success') {
        setNews(result.news || []);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
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
    console.log(sports)
      
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

 // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save news (add or update)
  const handleSaveNews = async () => {
    try {
      // If editing, include the news_id
      const payload = selectedItem 
        ? { ...newsForm, news_id: selectedItem.id }
        : newsForm;

      const response = await fetch("/api/news/addOrUpdateNews", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        fetchNews(); // Refresh news list
        setIsModalOpen(false);
        setSelectedItem(null);
        // Reset form
        setNewsForm({
          headline: '',
          sport_id: '',
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error saving news:', error);
      setError('Unable to save news');
    }
  };

  //Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/news/delete_news?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        fetchNews(); // Refresh the news list
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Unable to delete news item');
    }
  };

  useEffect(() => {
    fetchNews();
    fetchSports();
  }, []);


  // Modal for Add/Edit News
  const renderNewsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded w-1/2">
        <h2 className="text-xl mb-4">
          {selectedItem ? 'Edit News' : 'Add New News'}
        </h2>
        
        <div className="mb-4">
          <label className="block mb-2">Headline</label>
          <input
            type="text"
            name="headline"
            value={newsForm.headline}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter headline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Sport</label>
          <select
            name="sport_id"
            value={newsForm.sport_id}
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
            onClick={handleSaveNews}
            className="bg-red-800 text-white p-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading news...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-800 mb-4">News Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-red-800 text-white p-2 rounded mb-4 flex items-center"
        >
          <FaPlus className="mr-2"/> Add News
        </button>
        <table className="w-full border">
          <thead>
            <tr className="bg-red-100">
              <th className="p-2">Headline</th>
              <th className="p-2">Sport</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.headline}</td>
                <td className="p-2">{item.sport}</td>
                <td className="p-2">{item.date}</td>
                <td className="p-2 flex space-x-2">
                  <FaEdit 
                    className="text-blue-600 cursor-pointer" 
                    onClick={() => {
                      setSelectedItem(item);
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
      
      {isModalOpen && renderNewsModal()}
    </div>
  );
};

export default NewsManagement;
