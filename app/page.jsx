"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LeafIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ImpactSection from '@/app/about/ImpactSection';
import HeroSection from '@/components/common/HeroSection';
import Navbar from '@/components/common/Navbar';
import FeaturesSection from '@/components/common/FeaturesSection';
import EventList from '@/components/solutions/EventList';
import FeaturedEventsSection from '@/app/featuredevents/FeaturedEvents';
import AboutUs from '@/app/about/AboutUs';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Events */}
      <FeaturedEventsSection />

      {/* About Section */}
      <AboutUs />

      {/* Impact Section */}
      <ImpactSection />      

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it — here's what our users have to say
            </p>
          </div>

      {/* Event List */}
      <EventList events={[]} /> {/* Replace with actual event data */}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">John Doe</h3>
                  <p className="text-gray-600">Event Organizer</p>
                </div>
              </div>
              <p className="text-gray-600">
                I've been using this system to manage my beach cleanup events for the
                past year, and I couldn't be happier with the results. The
                volunteer coordination feature has saved me so much time, and the
                QR check-in system is a game-changer.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Jane Smith</h3>
                  <p className="text-gray-600">Volunteer</p>
                </div>
              </div>
              <p className="text-gray-600">
                I've volunteered for several beach cleanup events using this system,
                and I'm always impressed by how organized and efficient it is. The
                QR check-in system makes it easy to track my hours, and the
                event management feature keeps me informed about upcoming events.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Bob Johnson</h3>
                  <p className="text-gray-600">Event Participant</p>
                </div>
              </div>
              <p className="text-gray-600">
                I recently participated in a beach cleanup event using this system,
                and I was blown away by how well it worked. The QR check-in system
                made it easy to sign in and out, and the event management feature
                kept me informed about the location and schedule of the event. I'll
                definitely be using this system for future events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="mb-6">Become a volunteer today and make a difference in your community.</p>
          <a href="/register" className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">Join the Movement</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
            <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <img/><img src="/logo.png" alt="Logo" />
              </div>
              </motion.div>
              <span className="ml-2 text-xl font-bold">Sproutify</span>
            </div>
            <p className="text-gray-400">
              Empowering activists to host environmental activities and volunteers to join the cause.
            </p>
          </div>
        </div>
      </footer>
    </div>

  
  )
}