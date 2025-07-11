"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Users, QrCode, ArrowRight, MapPin, ClipboardList, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

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

const features = [
  {
    icon: Calendar,
    title: 'Event Scheduling',
    description: 'Easily schedule beach cleanup events at your preferred time and location.',
  },
  {
    icon: MapPin,
    title: 'Location Mapping',
    description: 'Use our interactive map to find the best cleanup locations near you.',
  },
  {
    icon: Users,
    title: 'Volunteer Registration',
    description: 'Allow volunteers to sign up for cleanup events and track their attendance.',
  },
  {
    icon: ClipboardList,
    title: 'Event Checklist',
    description: 'Create and share a checklist of tasks and supplies needed for the cleanup event.',
  },
  {
    icon: BookOpen,
    title: 'Cleanup Guides',
    description: 'Access a library of cleanup guides and resources to help you plan and execute successful events.',
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Calendar className="w-6 h-6 text-white" />
              </motion.div>
              <span className="ml-2 text-2xl font-bold text-gray-900">Coastal Crew</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href={user.role === 'ADMIN' ? '/admin/dashboard' : '/volunteer/dashboard'}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Keep Our Beaches
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
                {' '}
                Clean
              </span>
            </motion.h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Join our community of environmental warriors. Organize, participate, and track beach cleanup events
              with our comprehensive management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <>
                  <motion.div
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/register" className="flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </motion.div>
                  <motion.div
                    className="border border-blue-500 text-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/login" className="flex items-center">
                      Login
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-us" class="py-16 bg-gray-100">
        <div class="container mx-auto px-4">
          <h2 class="text-4xl font-bold mb-8">About Us</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="mb-8 md:mb-0">
              <img src="https://images.squarespace-cdn.com/content/v1/65272e44bd4f9022f58884d2/1702591117221-8YP0K9IP9GWZXZWLCXJ3/Option%2B2-2%2B%281%29.png" alt="About Us Image" class="rounded-lg shadow-lg" />
            </div>
            <div class="flex flex-col justify-center">
              <p class="text-lg text-gray-700">
                We are a passionate group of volunteers dedicated to preserving and enhancing the beauty and health of our beaches. Our mission is to educate, engage, and empower our community to take an active role in maintaining clean and sustainable coastal environments.
              </p>
              <a href="/about" class="mt-4 inline-block text-blue-500 font-medium hover:underline">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage successful beach cleanup events
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of volunteers making our beaches cleaner every day.
          </p>
          {!user && (
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Join the Movement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">Coastal Crew</span>
            </div>
            <p className="text-gray-400">
              Making our oceans cleaner, one beach at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>

  
  )
}