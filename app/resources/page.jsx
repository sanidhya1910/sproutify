"use client";

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import the default styles for react-tabs

const ResourceDetailPage = ({ params }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { id } = params;

  const resource = {
    id,
    title: 'Environmental Guides',
    description: 'Comprehensive guides on organizing beach cleanup events and tree plantation activities.',
    content: [
      // Beach Cleanup Guide
      {
        type: 'BeachCleanupGuide',
        heading: 'Beach Cleanup Guide',
        sections: [
          { title: "Preparation", text: "..." },
          { title: "Safety Measures", text: "..." },
          { title: "Cleanup Process", text: "..." },
          { title: "After Cleanup", text: "..." }
        ]
      },
      // Tree Plantation Guide
      {
        type: 'TreePlantationGuide',
        heading: 'Tree Plantation Guide',
        sections: [
          { title: "Preparation", text: "Gather necessary materials and equipment for tree planting." },
          { title: "Safety Measures", text: "Ensure safety while handling tools and plants." },
          { title: "Plantation Process", text: "Follow a step-by-step guide on how to plant trees correctly." },
          { title: "Care and Maintenance", text: "Learn about the proper care and maintenance of newly planted trees." }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"></div>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
        <p className="mb-4">{resource.description}</p>

        {/* Tabs */}
        <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
          <div className="bg-white p-4 rounded-lg shadow">
            <TabList>
              <Tab>Beach Cleanup Guide</Tab>
              <Tab>Tree Plantation Guide</Tab>
            </TabList>

            {/* Tab Panels */}
            <TabPanel>
              {resource.content.map((guide, index) => (
                guide.type === 'BeachCleanupGuide' && (
                  <div key={index}>
                    <h2 className="text-2xl font-bold mb-4">{guide.heading}</h2>
                    {guide.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="bg-white bg-opacity-75 p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                        <p>{section.text}</p>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </TabPanel>

            <TabPanel>
              {resource.content.map((guide, index) => (
                guide.type === 'TreePlantationGuide' && (
                  <div key={index}>
                    <h2 className="text-2xl font-bold mb-4">{guide.heading}</h2>
                    {guide.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="bg-white bg-opacity-75 p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                        <p>{section.text}</p>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
