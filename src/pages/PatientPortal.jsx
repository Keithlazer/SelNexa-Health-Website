import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  FileText, 
  Calendar, 
  Pill, 
  Activity, 
  Download,
  Eye,
  Plus,
  Bell
} from 'lucide-react'

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  const medicalRecords = [
    {
      id: 1,
      title: 'Annual Physical Exam',
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      type: 'Examination Report'
    },
    {
      id: 2,
      title: 'Blood Test Results',
      date: '2024-01-05',
      doctor: 'Dr. Mike Wilson',
      type: 'Lab Results'
    },
    {
      id: 3,
      title: 'X-Ray Report',
      date: '2023-12-20',
      doctor: 'Dr. Emily Brown',
      type: 'Imaging Report'
    }
  ]

  const medications = [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Johnson',
      startDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribedBy: 'Dr. Sarah Johnson',
      startDate: '2023-12-15'
    }
  ]

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      date: '2024-01-25',
      time: '10:00 AM',
      type: 'Follow-up'
    },
    {
      id: 2,
      doctor: 'Dr. Mike Wilson',
      specialty: 'Cardiology',
      date: '2024-02-01',
      time: '2:30 PM',
      type: 'Consultation'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Health Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Overall Health</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">Good</p>
              </div>
              <div className="card text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Next Appointment</h3>
                <p className="text-sm text-gray-600 mt-1">Jan 25, 10:00 AM</p>
              </div>
              <div className="card text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Pill className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Active Medications</h3>
                <p className="text-2xl font-bold text-purple-600 mt-1">2</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New lab results available</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Appointment confirmed</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'records':
        return (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Medical Records</h3>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Request Records
              </button>
            </div>
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{record.title}</h4>
                    <p className="text-sm text-gray-500">{record.type} • {record.doctor}</p>
                    <p className="text-sm text-gray-500">{record.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                    <button className="btn btn-outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'appointments':
        return (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {appointment.type}
                    </span>
                    <button className="btn btn-outline">Reschedule</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'medications':
        return (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Current Medications</h3>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </button>
            </div>
            <div className="space-y-4">
              {medications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{medication.name}</h4>
                    <p className="text-sm text-gray-500">{medication.dosage} • {medication.frequency}</p>
                    <p className="text-sm text-gray-500">Prescribed by {medication.prescribedBy}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input type="text" className="input" defaultValue="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input type="text" className="input" defaultValue="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input type="email" className="input" defaultValue="john.doe@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input type="tel" className="input" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input type="date" className="input" defaultValue="1985-06-15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select className="input">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea className="input" rows="3" defaultValue="123 Main St, Anytown, ST 12345"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
          <p className="text-gray-600 mt-2">Manage your health information and appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientPortal