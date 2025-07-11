import React from 'react';

const ImpactSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white-900 mb-4">
            Our Impact
          </h2>
          <p className="text-xl text-white-600">
            Together, we've made a difference in protecting and preserving our
            coastal environments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-teal-600 mb-4">50+</div>
            <div className="text-lg text-white-600">Cleanup Events</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-teal-600 mb-4">2000+</div>
            <div className="text-lg text-white-600">Volunteers Engaged</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-teal-600 mb-4">5000+</div>
            <div className="text-lg text-white-600">Pounds of Trash Collected</div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white-100 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white-900 mb-4">
              Empowering Communities
            </h3>
            <p className="text-white-600">
              By providing education and resources, we've enabled communities to
              take an active role in maintaining clean and sustainable coastal
              environments.
            </p>
          </div>
          <div className="bg-white-100 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white-900 mb-4">
              Inspiring Change
            </h3>
            <p className="text-white-600">
              Through our advocacy efforts and community engagement initiatives,
              we've inspired positive change and created a lasting impact on the
              health and beauty of our coastlines.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/donate"
            className="inline-block bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-teal-700 transition-colors"
          >
            Make a Donation
          </a>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;