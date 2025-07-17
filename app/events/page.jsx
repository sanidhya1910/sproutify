// coastal-crew/app/events/[id]/page.jsx
import React from 'react';
import Navbar from '@/components/common/Navbar';

const EventDetailPage = ({ params }) => {
  const { id } = params;

  // Sample data for demonstration purposes
  const event = {
    id,
    title: 'Beach Cleanup Event',
    description: 'Join us for a beach cleanup event. We will meet at the pier and clean the beach together.',
    date: '2023-10-15',
    time: '9:00 AM - 12:00 PM',
    location: 'City Beach Park',
    organizer: 'Green Team',
    contactEmail: 'greenteam@example.com',
    contactPhone: '+1 (123) 456-7890',
    imageUrl: '/images/beach-cleanup.jpg',
    details: [
      "Bring your own gloves and reusable bags.",
      "Meet at the pier entrance.",
      "Free refreshments provided."
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"></div>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <img src={event.imageUrl} alt={event.title} className="mb-4" />
        <p className="mb-2"><strong>Date:</strong> {event.date}</p>
        <p className="mb-2"><strong>Time:</strong> {event.time}</p>
        <p className="mb-2"><strong>Location:</strong> {event.location}</p>
        <p className="mb-2"><strong>Organizer:</strong> {event.organizer}</p>
        <p className="mb-2"><strong>Contact Email:</strong> {event.contactEmail}</p>
        <p className="mb-2"><strong>Contact Phone:</strong> {event.contactPhone}</p>
        <h2 className="text-2xl font-bold mt-4">Event Description</h2>
        <p>{event.description}</p>
        <h2 className="text-2xl font-bold mt-4">Additional Details</h2>
        <ul className="list-disc list-inside">
          {event.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetailPage;
