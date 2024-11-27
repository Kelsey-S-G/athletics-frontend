import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Clock, ChevronRight } from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/get_events");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setEvents(data.events);
        } else {
          throw new Error(data.message || 'Failed to fetch events');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Separate events into upcoming and past based on current date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const { upcomingEvents, pastEvents } = events.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate >= currentDate) {
      acc.upcomingEvents.push(event);
    } else {
      acc.pastEvents.push(event);
    }
    return acc;
  }, { upcomingEvents: [], pastEvents: [] });

  // Sort upcoming events by date (earliest first)
  upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  // Sort past events by date (most recent first)
  pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  const EventCard = ({ event, isPast }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-red-800" />
      <CardHeader className="space-y-1 pl-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-red-800">
            {event.sport}
          </span>
          {!isPast && (
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-800 bg-red-100 rounded-full">
              Upcoming
            </span>
          )}
        </div>
        <CardTitle className="text-2xl font-extrabold flex items-center group-hover:text-red-800 transition-colors">
          {event.name}
          <ChevronRight className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pl-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="h-5 w-5 text-red-800" />
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="h-5 w-5 text-red-800" />
              <span className="font-medium">{event.time}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="h-5 w-5 text-red-800" />
            <span className="font-medium">{event.location}</span>
          </div>
          {isPast ? (
            <div className="flex items-center gap-3 text-gray-700">
              <Trophy className="h-5 w-5 text-red-800" />
              <span className="font-medium">{event.result}</span>
            </div>
          ) : (
            <p className="text-gray-600 mt-2 font-medium">{event.details}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-xl font-semibold text-gray-700">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="bg-gray-200 p-16">
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-white shadow-lg">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-red-800 data-[state=active]:text-white"
            >
              UPCOMING EVENTS ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-red-800 data-[state=active]:text-white"
            >
              PAST EVENTS ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={false} />
              ))}
              {upcomingEvents.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-600">
                  No upcoming events scheduled
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={true} />
              ))}
              {pastEvents.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-600">
                  No past events to display
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Events;
