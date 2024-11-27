import React, { useState } from 'react';
import { 
  FaNewspaper, FaTrophy, FaRunning, FaCalendarAlt, 
  FaTshirt, FaTicketAlt
} from 'react-icons/fa';

// Import management components
import NewsManagement from './NewsManagement';
import HighlightsManagement from './HighlightsManagement';
import AthletesManagement from './AthletesManagement';
import EventsManagement from './EventManagement';
import AthletesOfTheWeekManagement from './AthletesOfTheWeekManagement';
import TeamsManagement from './TeamsManagement';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('news');

  const sections = [
    { name: 'news', icon: FaNewspaper, title: 'News Management', Component: NewsManagement },
    { name: 'highlights', icon: FaTrophy, title: 'Highlights Management', Component: HighlightsManagement },
    { name: 'athletes', icon: FaRunning, title: 'Athletes Management', Component: AthletesManagement },
    { name: 'events', icon: FaCalendarAlt, title: 'Events Management', Component: EventsManagement },
    { name: 'athletesoftheweek', icon: FaTrophy, title: 'Athletes of the Week', Component: AthletesOfTheWeekManagement },
    { name: 'teams', icon: FaTshirt, title: 'Teams Management', Component: TeamsManagement },
    // { name: 'tickets', icon: FaTicketAlt, title: 'Tickets Management', Component: null }
  ];

  const renderActiveSection = () => {
    const currentSection = sections.find(section => section.name === activeSection);
    return currentSection && currentSection.Component 
      ? <currentSection.Component /> 
      : null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-red-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        {sections.map(section => (
          <div 
            key={section.name}
            className={`flex items-center p-3 cursor-pointer hover:bg-red-700 ${
              activeSection === section.name ? 'bg-red-700' : ''
            }`}
            onClick={() => setActiveSection(section.name)}
          >
            <section.icon className="mr-3"/>
            {section.title}
          </div>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-auto">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;