"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/ui/navigation'
import AuthGuard from '@/components/ui/auth-guard'
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle, Mail, Award, TrendingUp, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default function VolunteerDetails() {
  const params = useParams()
  const [volunteer, setVolunteer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchVolunteer()
    }
  }, [params.id])

  const fetchVolunteer = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/volunteers/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setVolunteer(data)
      }
    } catch (error) {
      console.error('Error fetching volunteer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getVolunteerStatus = (volunteer) => {
    if (volunteer.stats.attendedEvents >= 10) {
      return { label: 'Champion', color: 'bg-purple-100 text-purple-800', icon: Award }
    } else if (volunteer.stats.attendedEvents >= 5) {
      return { label: 'Active', color: 'bg-green-100 text-green-800', icon: TrendingUp }
    } else if (volunteer.stats.registeredEvents > 0) {
      return { label: 'Registered', color: 'bg-blue-100 text-blue-800', icon: UserCheck }
    } else {
      return { label: 'New', color: 'bg-gray-100 text-gray-800', icon: Users }
    }
  }

  const getAttendanceRate = (volunteer) => {
    if (volunteer.stats.registeredEvents === 0) return 0
    return Math.round((volunteer.stats.attendedEvents / volunteer.stats.registeredEvents) * 100)
  }

  const getEventStatus = (eventDate) => {
    const now = new Date()
    const event = new Date(eventDate)
    
    if (event < now) {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800' }
    } else {
      return { label: 'Upcoming', color: 'bg-green-100 text-green-800' }
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

  if (!volunteer) {
    return (
      <AuthGuard requiredRole="ADMIN">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Volunteer not found</h1>
              <Link href="/admin/volunteers" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                Back to Volunteers
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const status = getVolunteerStatus(volunteer)
  const attendanceRate = getAttendanceRate(volunteer)

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/volunteers"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Volunteers
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">
                    {volunteer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{volunteer.name}</h1>
                  <div className="flex items-center mt-2 space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                      <status.icon className="w-4 h-4 mr-1" />
                      {status.label}
                    </span>
                    <span className="text-gray-500 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {volunteer.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Statistics */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Events Registered</span>
                    <span className="text-2xl font-bold text-blue-600">{volunteer.stats.registeredEvents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Events Attended</span>
                    <span className="text-2xl font-bold text-green-600">{volunteer.stats.attendedEvents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attendance Rate</span>
                    <span className="text-2xl font-bold text-purple-600">{attendanceRate}%</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Attendance Progress</span>
                    <span className="text-sm font-medium text-gray-900">{attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${attendanceRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Join Date</p>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(volunteer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="text-gray-900">
                      {Math.floor((new Date() - new Date(volunteer.createdAt)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-gray-900">{volunteer.role}</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  {volunteer.stats.attendedEvents >= 1 && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">First Event</p>
                        <p className="text-xs text-blue-700">Attended first cleanup event</p>
                      </div>
                    </div>
                  )}
                  {volunteer.stats.attendedEvents >= 5 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Active Volunteer</p>
                        <p className="text-xs text-green-700">Attended 5+ events</p>
                      </div>
                    </div>
                  )}
                  {volunteer.stats.attendedEvents >= 10 && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <Award className="w-5 h-5 text-purple-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-900">Champion</p>
                        <p className="text-xs text-purple-700">Attended 10+ events</p>
                      </div>
                    </div>
                  )}
                  {attendanceRate >= 80 && volunteer.stats.registeredEvents >= 3 && (
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-yellow-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">Reliable</p>
                        <p className="text-xs text-yellow-700">80%+ attendance rate</p>
                      </div>
                    </div>
                  )}
                  {volunteer.stats.attendedEvents === 0 && volunteer.stats.registeredEvents > 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No achievements yet</p>
                      <p className="text-xs text-gray-400">Attend events to earn achievements</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Event History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Registered Events */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event History</h3>
                {volunteer.registrations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No events registered yet</p>
                ) : (
                  <div className="space-y-4">
                    {volunteer.registrations.map((registration) => {
                      const hasAttended = volunteer.attendances.some(att => att.eventId === registration.event.id)
                      const eventStatus = getEventStatus(registration.event.date)
                      
                      return (
                        <div key={registration.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-gray-900">{registration.event.title}</h4>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventStatus.color}`}>
                                  {eventStatus.label}
                                </span>
                                {hasAttended && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Attended
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                  {registration.event.location}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  {new Date(registration.event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                  {registration.event.startTime} - {registration.event.endTime}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {registration.event.description}
                              </p>
                            </div>
                            
                            <div className="ml-4">
                              <Link
                                href={`/admin/events/${registration.event.id}`}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                              >
                                View Event
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}