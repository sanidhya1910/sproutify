import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Jane Smith',
      image: '/testimonials/jane-smith.jpg',
      testimonial:
        'Coastal Crew has made a huge difference in our community. Their cleanup events and educational programs have not only improved the appearance of our beaches but also raised awareness about the importance of preserving and protecting our coastal environments. I\'m proud to support such an impactful organization.',
    },
    {
      name: 'Greenpeace International',
      image: '/testimonials/greenpeace.webp',
      testimonial:
        'We have partnered with Coastal Crew on several initiatives to combat plastic pollution in our oceans. Their commitment to sustainable practices and their focus on community engagement have been instrumental in driving positive change. We highly recommend Coastal Crew as a partner in the fight for a clean and healthy coastal environment.',
    },
    // add more testimonials as needed
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Testimonials
          </h2>
          <p className="text-xl text-gray-600">
            Hear from individuals and organizations who have benefited from our
            efforts to protect and preserve coastal environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {testimonial.name}
              </h3>
              <p className="text-gray-600">{testimonial.testimonial}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="/support"
            className="inline-block bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-teal-700 transition-colors"
          >
            Become a Supporter
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;