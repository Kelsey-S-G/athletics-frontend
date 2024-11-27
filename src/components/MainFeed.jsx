import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { newsFeedData } from "../data/Data";

const MainFeed = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Highlights Section */}
        <div className="lg:w-2/3">
          <Highlights />
        </div>

        {/* News Section */}
        <div className="lg:w-1/3">
          <News />
        </div>
      </div>
    </div>
  );
};

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch('/api/highlights/get_highlights');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHighlights(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <h2 className="text-xl font-bold text-red-900 p-4">HIGHLIGHTS</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {highlights.map((highlight, index) => (
          <motion.article
            key={highlight.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="md:w-1/3">
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Content */}
              <div className="md:w-2/3">
                <span className="text-sm text-gray-500">
                  {new Date(highlight.date).toLocaleDateString()}
                </span>
                <h3 className="mt-2 text-xl font-bold text-gray-900 hover:text-red-900 transition-colors">
                  {highlight.title}
                </h3>
                <a
                  href={highlight.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-red-900 font-semibold hover:text-red-700 transition-colors"
                >
                  View →
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news/get_news');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setNews(data.news);
        } else {
          throw new Error(data.message || 'Failed to fetch news');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <h2 className="text-xl font-bold text-red-900 p-4">LATEST NEWS</h2>
      </div>

      <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
        {news.map((newsItem, index) => (
          <motion.article
            key={newsItem.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-sm font-medium text-red-900 bg-red-100 rounded-full">
                {newsItem.sport}
              </span>
              <span className="text-sm text-gray-500">{newsItem.date}</span>
            </div>

            <h3 className="font-semibold text-gray-900 hover:text-red-900 transition-colors cursor-pointer">
              {newsItem.headline}
            </h3>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default MainFeed;
