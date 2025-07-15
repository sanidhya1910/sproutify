import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-700 mb-4">{event.description}</p>
        <a href={`/events/${event.id}`} className="text-green-500 hover:underline">
          Learn More
        </a>
      </div>
    </div>
  );
};

export default EventCard;