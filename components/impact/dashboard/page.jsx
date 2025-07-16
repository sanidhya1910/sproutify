import React from 'react';
import DashboardChart from '@/components/impact/DashboardChart';

const ImpactDashboardPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Impact Dashboard</h1>
      {/* Render charts and impact data */}
      <DashboardChart />
    </div>
  );
};

export default ImpactDashboardPage;