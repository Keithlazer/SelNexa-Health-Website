import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Phone, MessageCircle, Users, Calendar, Clock, Settings } from 'lucide-react'

const Telemedicine = () => {
  const [activeCall, setActiveCall] = useState(null)
  const [callStatus, setCallStatus] = useState('idle') // idle, connecting, connected, ended

  const upcomingSessions = [
    {
      id: 1,
      patientName: 'John Doe',
      time: '10:00 AM',
      date: 'Today',
      type: 'Follow-up Consultation',
      avatar: null
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      time: '2:30 PM',
      date: 'Today',
      type: 'Initial Consultation',
      avatar: null
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      time: '9:00 AM',
      date: 'Tomorrow',
      type: 'Prescription Review',
      avatar: null
    }
  ]

  const startCall = (sessionId) => {
    setActiveCall(sessionId)
    setCallStatus('connecting')
    
    // Simulate connection
    setTimeout(() => {
      setCallStatus('connected')
    }, 2000)
  }

  const endCall = () => {
    setCallStatus('ended')
    setTimeout(() => {
      setActiveCall(null)
      setCallStatus('idle')
    }, 1000)
  }

  if (activeCall) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-full h-full relative">
          {/* Video Call Interface */}
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            {callStatus === 'connecting' ? (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-xl">Connecting...</p>
              </div>
            ) : callStatus === 'connected' ? (
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-16 h-16" />
                </div>
                <p className="text-xl mb-2">Connected with John Doe</p>
                <p className="text-gray-300">Call duration: 00:45</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <p className="text-xl">Call Ended</p>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4">
              <button className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500">
                <Video className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500">
                <Phone className="w-6 h-6" />
              </button>
              <button 
                onClick={endCall}
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700"
              >
                <Phone className="w-6 h-6 transform rotate-135" />
              </button>
              <button className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Telemedicine</h1>
          <p className="text-gray-600 mt-2">Connect with patients through secure video consultations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn btn-primary">
                  <Video className="w-4 h-4 mr-2" />
                  Start Instant Meeting
                </button>
                <button className="w-full btn btn-outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </button>
                <button className="w-full btn btn-outline">
                  <Users className="w-4 h-4 mr-2" />
                  Join Meeting
                </button>
              </div>
            </div>

            {/* Session Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Today's Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sessions Completed</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-semibold">4h 32m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upcoming Sessions</span>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold">
                          {session.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{session.patientName}</h4>
                        <p className="text-sm text-gray-500">{session.type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{session.date} at {session.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => startCall(session.id)}
                        className="btn btn-primary"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Call
                      </button>
                      <button className="btn btn-outline">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Sarah Wilson</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Jan 15, 2024 - 9:00 AM</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">45 minutes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Telemedicine