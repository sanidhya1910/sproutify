"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/ui/navigation'
import AuthGuard from '@/components/ui/auth-guard'
import { Calendar, MapPin, Clock, Users, Shield, ArrowLeft, CheckCircle, AlertCircle, UserPlus, UserMinus } from 'lucide-react'
import Link from 'next/link'

export default function EventDetails() {
  const params = useParams()
  const [event, setEvent] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [registrationLoading, setRegistrationLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchEvent()
      checkRegistration()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/volunteer/events/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkRegistration = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/volunteer/events/${params.id}/registration`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsRegistered(data.isRegistered)
      }
    } catch (error) {
      console.error('Error checking registration:', error)
    }
  }

  const handleRegister = async () => {
    setRegistrationLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/volunteer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: params.id })
      })

      if (response.ok) {
        setIsRegistered(true)
        // Refresh event data to update registration count
        fetchEvent()
      } else {
        const data = await response.json()
        alert(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Error registering for event:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setRegistrationLoading(false)
    }
  }

  const handleUnregister = async () => {
    setRegistrationLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/volunteer/unregister', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: params.id })
      })

      if (response.ok) {
        setIsRegistered(false)
        // Refresh event data to update registration count
        fetchEvent()
      } else {
        const data = await response.json()
        alert(data.message || 'Unregistration failed')
      }
    } catch (error) {
      console.error('Error unregistering from event:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setRegistrationLoading(false)
    }
  }

  const getEventStatus = (eventDate) => {
    const now = new Date()
    const event = new Date(eventDate)
    
    if (event < now) {
      return { label: 'Past Event', color: 'bg-gray-100 text-gray-800', disabled: true }
    } else {
      return { label: 'Upcoming Event', color: 'bg-green-100 text-green-800', disabled: false }
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="VOLUNTEER">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!event) {
    return (
      <AuthGuard requiredRole="VOLUNTEER">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
              <Link href="/volunteer/events" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const status = getEventStatus(event.date)

  return (
    <AuthGuard requiredRole="VOLUNTEER">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/volunteer/events"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    {status.label}
                  </span>
                  {isRegistered && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Registered
                    </span>
                  )}
                </div>
              </div>
              
              {!status.disabled && (
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  {isRegistered ? (
                    <button
                      onClick={handleUnregister}
                      disabled={registrationLoading}
                      className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registrationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Unregistering...
                        </>
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4 mr-2" />
                          Unregister
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registrationLoading}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registrationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Registering...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Register for Event
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-900">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Time</p>
                        <p className="text-gray-900">{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Volunteers</p>
                        <p className="text-gray-900">
                          {event._count.registrations} registered
                          {event.expectedVolunteers && ` / ${event.expectedVolunteers} expected`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Event</h3>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>

              {/* Safety Instructions */}
              {event.safetyInstructions && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Safety Instructions</h3>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{event.safetyInstructions}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Your Status</span>
                    {isRegistered ? (
                      <span className="inline-flex items-center text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Registered
                      </span>
                    ) : (
                      <span className="text-gray-500">Not Registered</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Registered</span>
                    <span className="font-medium text-gray-900">{event._count.registrations}</span>
                  </div>
                  {event.expectedVolunteers && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expected</span>
                      <span className="font-medium text-gray-900">{event.expectedVolunteers}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Organizer */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Organizer</h3>
                <div>
                  <p className="font-medium text-gray-900">{event.creator.name}</p>
                  <p className="text-sm text-gray-500">{event.creator.email}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Event created on {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* What to Bring */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Bring</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Reusable water bottle
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Sun protection (hat, sunscreen)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Comfortable walking shoes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Work gloves (if available)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Positive attitude!
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  Cleanup supplies and trash bags will be provided
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}