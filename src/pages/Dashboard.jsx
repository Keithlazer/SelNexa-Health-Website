import React from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Heart
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Patients',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Appointments Today',
      value: '24',
      change: '+8%',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Active Monitoring',
      value: '156',
      change: '+5%',
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      icon: Heart,
      color: 'bg-red-500'
    }
  ]

  const chartData = [
    { name: 'Jan', patients: 400, appointments: 240 },
    { name: 'Feb', patients: 300, appointments: 139 },
    { name: 'Mar', patients: 200, appointments: 980 },
    { name: 'Apr', patients: 278, appointments: 390 },
    { name: 'May', patients: 189, appointments: 480 },
    { name: 'Jun', patients: 239, appointments: 380 },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment scheduled with Dr. Smith',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'alert',
      message: 'Patient vital signs alert - John Doe',
      time: '5 minutes ago',
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      id: 3,
      type: 'completed',
      message: 'Telemedicine session completed',
      time: '10 minutes ago',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'system',
      message: 'System backup completed successfully',
      time: '1 hour ago',
      icon: Activity,
      color: 'text-purple-500'
    }
  ]

  // Search/filter state
  const [search, setSearch] = React.useState("");

  // Tooltip helper
  const renderTooltip = (text) => (
    <span className="inline-block ml-2 text-xs text-gray-400" title={text}>ⓘ</span>
  );

  // Quick actions
  const quickActions = [
    { label: "Add Patient", onClick: () => alert("Add Patient clicked") },
    { label: "Book Appointment", onClick: () => alert("Book Appointment clicked") },
    { label: "Send Message", onClick: () => alert("Send Message clicked") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your healthcare platform.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          {quickActions.map((action) => (
            <button key={action.label} className="btn px-4 py-2 bg-blue-600 text-white font-semibold" onClick={action.onClick}>
              {action.label}
            </button>
          ))}
        </div>

        {/* Search/Filter */}
        <div className="mb-6 flex items-center gap-2">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full max-w-xs"
            placeholder="Search patients or appointments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                      {renderTooltip(`Shows ${stat.title.toLowerCase()} for your organization`)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Patient Trends {renderTooltip("Monthly patient and appointment trends")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Monthly Overview {renderTooltip("Monthly appointment totals")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activities {renderTooltip("Latest actions and alerts")}</h3>
          <div className="space-y-4">
            {recentActivities
              .filter(a => a.message.toLowerCase().includes(search.toLowerCase()))
              .map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </motion.div>

        {/* Privacy Notice */}
        <div className="mt-8 text-xs text-gray-400 text-center">
          <span>Patient data is protected and visible only to authorized users. <a href="/privacy.html" className="underline">Privacy Policy</a></span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard