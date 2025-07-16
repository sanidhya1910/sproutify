import React from 'react';
import ImpactSection from './ImpactSection';
import TeamMember from './TeamMember';
import TestimonialsSection from './TestimonialsSection';
import VolunteerStoriesSection from './VolunteerStoriesSection';

const AboutPage = () => {
  return (
    <div>
      {/* Existing ImpactSection */}
      <ImpactSection />

      {/* Team Members Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold">Our Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto">
          {/* Render TeamMember components */}
          <TeamMember image="team/obaidur-rahman.webp"name="Obaidur Rahman" role="Founder" />
          <TeamMember image="team/sanidhya-ravi.jpg"name="Sanidhya Ravi" role="Project Manager" />
          <TeamMember name="Mike Johnson" role="Volunteer Coordinator" />
        </div>
      </section>

      {}
      <TestimonialsSection />

      {}
      <VolunteerStoriesSection />
    </div>
  );
};

export default AboutPage;