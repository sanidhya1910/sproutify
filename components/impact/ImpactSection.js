import React from 'react';
import ImpactCard from './ImpactCard';

const impactData = [
  { title: 'Beaches Cleaned', value: '50+' },
  { title: 'Trees Planted', value: '2,000+' },
  { title: 'Volunteers', value: '1,500+' },
];

const ImpactSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold">Our Impact</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto">
        {impactData.map((item, index) => (
          <ImpactCard key={index} title={item.title} value={item.value} />
        ))}
      </div>
    </section>
  );
};

export default ImpactSection;
