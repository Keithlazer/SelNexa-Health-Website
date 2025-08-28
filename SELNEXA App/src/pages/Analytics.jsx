import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('patients')

  const patientData = [
    { month: 'Jan', patients: 1200, appointments: 800, revenue: 45000 },
    { month: 'Feb', patients: 1350, appointments: 920, revenue: 52000 },
    { month: 'Mar', patients: 1100, appointments: 750, revenue: 41000 },
    { month: 'Apr', patients: 1450, appointments: 1100, revenue: 58000 },
    { month: 'May', patients: 1600, appointments: 1250, revenue: 65000 },
    { month: 'Jun', patients: 1750, appointments: 1400, revenue: 72000 },
  ]

  const departmentData = [
    { name: 'Cardiology', value: 30, color: '#ef4444' },
    { name: 'Pediatrics', value: 25, color: '#3b82f6' },
    { name: 'Orthopedics', value: 20, color: '#10b981' },
    { name: 'Neurology', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#8b5cf6' },
  ]

  const kpiData = [
    {
      title: 'Total Patients',
      value: '8,450',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Appointments',
      value: '6,220',
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: '$333K',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Activity,
      color: 'text-red-600'
    }
  ]

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your healthcare operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <button className="btn btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{kpi.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Patient Trends</h3>
              <div className="flex items-center space-x-2">
                <LineChart className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Department Distribution</h3>
              <PieChart className="w-4 h-4 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dept.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{dept.name}</span>
                  <span className="text-sm font-medium">{dept.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Revenue and Appointments Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue & Appointments</h3>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="appointments" fill="#3b82f6" name="Appointments" />
              <Bar yAxisId="right" dataKey="revenue" fill="#ef4444" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Metrics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Patient Satisfaction
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.8/5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.6/5</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      +4.3%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.5/5</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Average Wait Time
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12 min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15 min</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      -20%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10 min</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    No-show Rate
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.2%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">9.1%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      -9.9%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics