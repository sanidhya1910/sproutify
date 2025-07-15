// coastal-crew/app/events/[id]/page.jsx
import React from 'react';
import Navbar from '@/components/common/Navbar';

const EventDetailPage = ({ params }) => {
  const { id } = params;

  // Sample data for demonstration purposes, replace with your own data source
  const events = [
    {
      id: '1',
      title: 'Beach Cleanup Event',
      description: 'Join us for a beach cleanup event. We will meet at the pier and clean the beach together.',
      // Add more event details here...
    },
    {
      id: '2',
      title: 'Tree Planting Event',
      description: 'Help us plant trees in our local forest to support wildlife and improve air quality.',
      // Add more event details here...
    }
    // Add more events here as needed...
  ];

  const event = events.find(event => event.id === id);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto py-8">
        {event ? (
          <>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p1>{event.description}</p1>
          </>
        ) : (
          <p>Event not found</p>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
