import React from 'react'
import PatientPortal from '../pages/PatientPortal'
import Dashboard from '../pages/Dashboard'
import Telemedicine from '../pages/Telemedicine'

export const PatientAppMockup: React.FC = () => {
  return (
    <div className="selnexa-embed-content">
      <PatientPortal />
    </div>
  )
}

export const ProviderDashboardMockup: React.FC = () => {
  return (
    <div className="selnexa-embed-content">
      <Dashboard />
    </div>
  )
}

export const AdminDashboardMockup: React.FC = () => {
  return (
    <div className="selnexa-embed-content">
      <Dashboard />
    </div>
  )
}

export default PatientAppMockup
