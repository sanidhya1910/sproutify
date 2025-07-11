import React from 'react';
import { Leaf as LeafIcon } from 'lucide-react'; // Adjust the path if needed
import TeamMember from './TeamMember';
import ImpactSection from './ImpactSection'; // new component
import VolunteerStoriesSection from './VolunteerStoriesSection'; // new component
import TestimonialsSection from './TestimonialsSection'; // new component

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Obaidur Rahman',
      role: 'Co-founder and CEO',
      image: '/team/obaidur-rahman.webp', // updated image path
    },
    {
      name: 'Sanidhya Ravi',
      role: 'Co-founder and Director of Operations',
      image: '/team/sanidhya-ravi.jpg', // updated image path
    },
    // add more team members as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-green-200 to-light-blue-200 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">Coastal Crew</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="inline-block bg-white text-green-600 font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-green-100 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 bg-gradient-to-r from-teal-600 to-light-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About Us
            </h2>
            <p className="text-xl">
              We are a community of environmental warriors dedicated to keeping our
              beaches clean and sustainable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Our Mission
              </h3>
              <p className="mb-6">
                At Coastal Crew, our mission is to unite communities to protect
                and preserve our coastal environments. We believe that everyone
                has a role to play in keeping our beaches clean and sustainable.
              </p>
              <p className="mb-6">
                Through education, advocacy, and community engagement, we aim to
                inspire positive change and create a lasting impact on the health
                and beauty of our coastlines.
              </p>
              <p className="mb-6">
                Join us in our mission and make a difference today.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">
                Our Team
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <TeamMember key={index} {...member} />
                ))}
              </div>
            </div>
          </div>

          <ImpactSection />
          <VolunteerStoriesSection />
          <TestimonialsSection />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;