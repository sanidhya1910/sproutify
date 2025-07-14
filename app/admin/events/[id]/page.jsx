"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/ui/navigation'
import AuthGuard from '@/components/ui/auth-guard'
import { Calendar, MapPin, Clock, Users, Shield, ArrowLeft, CheckCircle, UserCheck, UserPlus, UserMinus } from 'lucide-react'
import Link from 'next/link'

export default function EventDetails() {
  const params = useParams()
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceLoading, setAttendanceLoading] = useState(new Set())

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/events/${params.id}`, {
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

  const handleMarkAttendance = async (userId, isAttended) => {
    setAttendanceLoading(prev => new Set(prev).add(userId))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/events/${params.id}/attendance`, {
        method: isAttended ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        // Refresh event data to update attendance
        fetchEvent()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to update attendance')
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setAttendanceLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const getEventStatus = (eventDate) => {
    const now = new Date()
    const event = new Date(eventDate)
    
    if (event < now) {
      return { label: 'Past Event', color: 'bg-gray-100 text-gray-800' }
    } else {
      return { label: 'Upcoming Event', color: 'bg-green-100 text-green-800' }
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="ADMIN">
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
      <AuthGuard requiredRole="ADMIN">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
              <Link href="/admin/events" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
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
    <AuthGuard requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/events"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Event
                </Link>
              </div>
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
                        <p className="text-sm font-medium text-gray-500">Expected Volunteers</p>
                        <p className="text-gray-900">{event.expectedVolunteers || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>

              {/* Safety Instructions */}
              {event.safetyInstructions && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Safety Instructions</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{event.safetyInstructions}</p>
                </div>
              )}

              {/* Registered Volunteers */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Registered Volunteers</h3>
                  <span className="text-sm text-gray-500">
                    {event.registrations.length} registered • {event._count.attendances} attended
                  </span>
                </div>
                {event.registrations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No volunteers registered yet</p>
                ) : (
                  <div className="space-y-3">
                    {event.registrations.map((registration) => {
                      const hasAttended = event.attendances.some(att => att.userId === registration.user.id)
                      const isLoading = attendanceLoading.has(registration.user.id)
                      return (
                        <div key={registration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-medium text-sm">
                                {registration.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{registration.user.name}</p>
                              <p className="text-sm text-gray-500">{registration.user.email}</p>
                              <p className="text-xs text-gray-400">
                                Registered on {new Date(registration.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {hasAttended ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">Attended</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Not attended</span>
                            )}
                            <button
                              onClick={() => handleMarkAttendance(registration.user.id, hasAttended)}
                              disabled={isLoading}
                              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                hasAttended
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                            >
                              {isLoading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                              ) : hasAttended ? (
                                <UserMinus className="w-3 h-3 mr-1" />
                              ) : (
                                <UserPlus className="w-3 h-3 mr-1" />
                              )}
                              {isLoading ? 'Updating...' : hasAttended ? 'Remove' : 'Mark Present'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Attendance Summary */}
              {event.registrations.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{event.registrations.length}</p>
                      <p className="text-sm text-blue-800">Total Registered</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{event._count.attendances}</p>
                      <p className="text-sm text-green-800">Attended</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {event.registrations.length > 0 
                          ? Math.round((event._count.attendances / event.registrations.length) * 100)
                          : 0}%
                      </p>
                      <p className="text-sm text-orange-800">Attendance Rate</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Registered</span>
                    <span className="text-2xl font-bold text-blue-600">{event._count.registrations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attended</span>
                    <span className="text-2xl font-bold text-green-600">{event._count.attendances}</span>
                  </div>
                  {event.expectedVolunteers && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expected</span>
                      <span className="text-2xl font-bold text-gray-600">{event.expectedVolunteers}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Attendance Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {event.registrations.length > 0 
                          ? Math.round((event._count.attendances / event.registrations.length) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${event.registrations.length > 0 
                            ? Math.round((event._count.attendances / event.registrations.length) * 100)
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Creator */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Creator</h3>
                <div>
                  <p className="font-medium text-gray-900">{event.creator.name}</p>
                  <p className="text-sm text-gray-500">{event.creator.email}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created on {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Event Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {new Date(event.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}