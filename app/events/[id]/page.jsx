"use client";
// coastal-crew/app/events/[id]/page.jsx
import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";

export default function EventDetailPage({ params }) {
  const { id } = params;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Event data:", data);
        setEvent(data);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data for demonstration purposes, replace with your own data source
  // const events = [
  //   {
  //     id: '1',
  //     title: 'Beach Cleanup Event',
  //     description: 'Join us for a beach cleanup event. We will meet at the pier and clean the beach together.',
  //     // Add more event details here...
  //   },
  //   {
  //     id: '2',
  //     title: 'Tree Planting Event',
  //     description: 'Help us plant trees in our local forest to support wildlife and improve air quality.',
  //     // Add more event details here...
  //   }
  //   // Add more events here as needed...
  // ];

  // const event = events.find(event => event.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto py-8">
        {event ? (
          <>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <img
              src={event.imageUrl}
              alt={event.title}
              // width={500}
              // height={300}
              className="mb-4 rounded-lg shadow-md"
            />
            <p className="text-xl">{event.description}</p>
          </>
        ) : (
          <p>Event not found</p>
        )}
      </div>
    </div>
  );
}
