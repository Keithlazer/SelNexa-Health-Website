import { create } from 'zustand'

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  selectedDate: new Date(),
  availableSlots: [],
  loading: false,
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  fetchAppointments: async () => {
    set({ loading: true })
    try {
      // Simulate API call
      const response = await fetch('/api/appointments')
      const appointments = await response.json()
      set({ appointments, loading: false })
    } catch (error) {
      set({ loading: false })
      console.error('Failed to fetch appointments:', error)
    }
  },
  
  bookAppointment: async (appointmentData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      })
      
      if (response.ok) {
        const newAppointment = await response.json()
        set(state => ({
          appointments: [...state.appointments, newAppointment]
        }))
        return { success: true }
      }
      return { success: false, error: 'Failed to book appointment' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  },
  
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        set(state => ({
          appointments: state.appointments.filter(apt => apt.id !== appointmentId)
        }))
        return { success: true }
      }
      return { success: false, error: 'Failed to cancel appointment' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }
}))