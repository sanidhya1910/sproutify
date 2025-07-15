import React from 'react';

const SolutionCard = ({ id, title, description, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        <a href={`/events/${id}`} className="text-green-500 hover:underline">Learn More</a>

      </div>
    </div>
  );
};

export default SolutionCard;