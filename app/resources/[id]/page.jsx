import React from 'react';

const sampleResources = [
  { id: 1, title: "Guide to Beach Cleanup", description: "A comprehensive guide on how to organize effective beach cleanup events.", link: "#" },
  { id: 2, title: "Tree Planting Best Practices", description: "Learn the best practices for successful tree planting initiatives.", link: "#" },
];

const ResourcesPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleResources.map(resource => (
          <ResourceItem key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;