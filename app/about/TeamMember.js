// TeamMember.js
import React from 'react';

const TeamMember = ({ name, role, image }) => {
  return (
    <div className="text-center">
      <img src={image} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4" />
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
};

export default TeamMember;