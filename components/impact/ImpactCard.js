import React from 'react';

const ImpactCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default ImpactCard;