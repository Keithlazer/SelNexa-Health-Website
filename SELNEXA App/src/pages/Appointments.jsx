import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Plus, Search, Filter } from 'lucide-react'
import Calendar as ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('calendar') // 'calendar' or 'list'
  const [searchTerm, setSearchTerm] = useState('')

  const appointments = [
    {
      id: 1,
      patientName: 'John Doe',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'confirmed',
      date: new Date(2024, 0, 15)
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'pending',
      date: new Date(2024, 0, 15)
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      time: '02:00 PM',
      type: 'Telemedicine',
      status: 'confirmed',
      date: new Date(2024, 0, 15)
    }
  ]

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your appointments and schedule</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('calendar')}
              className={`btn ${view === 'calendar' ? 'btn-primary' : 'btn-outline'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView('list')}
              className={`btn ${view === 'list' ? 'btn-primary' : 'btn-outline'}`}
            >
              List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Select Date</h3>
              <ReactCalendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full border-none"
              />
            </div>
          </div>

          {/* Appointments View */}
          <div className="lg:col-span-2">
            {view === 'calendar' ? (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">
                  Appointments for {selectedDate.toDateString()}
                </h3>
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{appointment.time}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">All Appointments</h3>
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
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.patientName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.date.toDateString()}</div>
                            <div className="text-sm text-gray-500">{appointment.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointments