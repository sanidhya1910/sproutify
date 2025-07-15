'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { verifyToken } from '@/lib/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faBars, faBook, faCalendarAlt, faPhone, faSearch, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        setUser(decoded);
      }
    }
  }, []);

  return (
    <nav className="bg-gradient-to-r from-teal-600 via-green-500 to-teal-600 p-4 px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center text-white text-lg font-bold">
          <span className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span>Sproutify</span>
          </span>
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
        <Link href="/events" className="text-white"><FontAwesomeIcon icon={faCalendarAlt} /> Events</Link>
        <Link href="/about" className="text-white"> <FontAwesomeIcon icon={faAddressBook} /> About Us</Link>
        <Link href="/contact" className="text-white"><FontAwesomeIcon icon={faPhone} />Contact</Link>
        <Link href="/resources" className="text-white"><FontAwesomeIcon icon={faBook} /> Resources</Link>
        </div>
        {/* User options */}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.name}</span>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-white"><FontAwesomeIcon icon={faCog} /> Admin</Link>
              )}
              {user.role === 'volunteer' && (
                <Link href="/volunteer/dashboard" className="text-white"><FontAwesomeIcon icon={faUserShield} /> Volunteer</Link>
              )}
              <a href="#" className="text-white" onClick={() => {
                localStorage.removeItem('token');
                setUser(null);
              }}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</a>
            </>
          ) : (
            <Link href="/login" className="text-white"><FontAwesomeIcon icon={faUserCircle} /> Login</Link>
          )}
        </div>
        {/* Mobile menu toggle */}
        <button className="md:hidden text-white focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 items-center mt-4">
          <Link href="/events" className="text-white"><FontAwesomeIcon icon={faCalendarAlt} /> Events</Link>
          <Link href="/about" className="text-white">About Us</Link>
          <Link href="/contact" className="text-white">Contact</Link>
          <Link href="/resources" className="text-white"><FontAwesomeIcon icon={faBook} /> Resources</Link>
          {user ? (
            <>
              <span className="text-white">Welcome, {user.name}</span>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-white"><FontAwesomeIcon icon={faCog} /> Admin</Link>
              )}
              {user.role === 'volunteer' && (
                <Link href="/volunteer/dashboard" className="text-white"><FontAwesomeIcon icon={faUserShield} /> Volunteer</Link>
              )}
              <a href="#" className="text-white" onClick={() => {
                localStorage.removeItem('token');
                setUser(null);
              }}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</a>
            </>
          ) : (
            <Link href="/login" className="text-white"><FontAwesomeIcon icon={faUserCircle} /> Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
