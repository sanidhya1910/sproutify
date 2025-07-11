import React from 'react';
import TeamMember from './TeamMember';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Obaidur Rahman',
      role: 'Co-founder and CEO',
      image: 'john-doe.jpg',
    },
    {
      name: 'Sanidhya Ravi',
      role: 'Director of Operations',
      image: 'jane-smith.jpg',
    },
    // add more team members as needed
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Us
          </h2>
          <p className="text-xl text-gray-600">
            We are a community of environmental warriors dedicated to keeping our
            beaches clean and sustainable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-6">
              At Coastal Crew, our mission is to unite communities to protect
              and preserve our coastal environments. We believe that everyone
              has a role to play in keeping our beaches clean and sustainable.
            </p>
            <p className="text-gray-600 mb-6">
              Through education, advocacy, and community engagement, we aim to
              inspire positive change and create a lasting impact on the health
              and beauty of our coastlines.
            </p>
            <p className="text-gray-600">
              Join us in our mission and make a difference today.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Team
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMember key={index} {...member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;