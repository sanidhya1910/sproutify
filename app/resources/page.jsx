import React from 'react';
import Navbar from '@/components/common/Navbar';

const ResourceDetailPage = ({ params }) => {
  const { id } = params;

  const resource = {
    id,
    title: 'Complete Guide to Beach Cleanup',
    description: 'A comprehensive guide on how to organize effective beach cleanup events.',
    content: [
      {
        heading: "Preparation",
        text: "Before the event, make sure to secure all necessary permits and gather volunteers. Provide them with gloves, bags, and other essential supplies."
      },
      {
        heading: "Safety Measures",
        text: "Ensure that all participants follow safety guidelines. This includes wearing appropriate clothing, staying hydrated, and avoiding hazardous materials."
      },
      {
        heading: "Cleanup Process",
        text: "Divide the beach into sections and assign volunteers to each area. Encourage teamwork and regular check-ins throughout the event."
      },
      {
        heading: "After Cleanup",
        text: "Properly dispose of collected waste according to local regulations. Thank all participants for their efforts and share the impact of the cleanup."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
        <p className="mb-4">{resource.description}</p>
        {resource.content.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold">{section.heading}</h2>
            <p>{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceDetailPage;
