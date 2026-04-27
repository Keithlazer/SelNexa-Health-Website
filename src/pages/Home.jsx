import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Shield, 
  Brain, 
  Heart, 
  Smartphone,
  Globe,
  Activity,
  Calendar
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Diagnostics',
      description: 'Reduce diagnostic delay. AI analysis surfaces patterns that help clinicians move faster and more confidently.'
    },
    {
      icon: Shield,
      title: 'Secure Health Records',
      description: 'Keep patient data organized and auditable. One source of truth so nothing gets lost.'
    },
    {
      icon: Heart,
      title: 'Remote Patient Monitoring',
      description: 'Catch issues early. Real-time alerts mean fewer emergency visits and better patient outcomes.'
    },
    {
      icon: Smartphone,
      title: 'Telemedicine Platform',
      description: 'Meet patients where they are. Video consultations and follow-ups without the friction of scheduling overhead.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Patients Served' },
    { number: '500+', label: 'Healthcare Providers' },
    { number: '50+', label: 'Medical Facilities' },
    { number: '99.9%', label: 'Uptime Reliability' }
  ]

  const trustPoints = [
    {
      icon: Globe,
      title: 'Low-bandwidth ready',
      description: 'Built to stay usable on slower connections and mobile devices.'
    },
    {
      icon: Shield,
      title: 'Secure by design',
      description: 'Clear workflows for keeping clinical data protected and auditable.'
    },
    {
      icon: Activity,
      title: 'Built for care teams',
      description: 'Tools that reduce manual work and keep teams moving.'
    }
  ]

  const outcomes = [
    {
      icon: Calendar,
      title: 'See 20% more patients',
      description: 'Eliminate scheduling friction and double-booking. Appointment workflow handles edge cases so staff do less manual work.'
    },
    {
      icon: Shield,
      title: 'Keep records audit-ready',
      description: 'Automatic timestamps and access logs so compliance is built in. No scrambling when donors or regulators ask questions.'
    },
    {
      icon: Heart,
      title: 'Don\'t lose patients to follow-up',
      description: 'Automated reminders and telemedicine make it easy for patients to stay engaged. Better outcomes, fewer readmissions.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide text-white/90"
              >
                Healthcare operations for modern clinics
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-6 text-4xl md:text-6xl font-bold leading-tight"
              >
                Reduce friction. Keep patients moving.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="mt-6 text-lg md:text-xl max-w-2xl text-gray-100"
              >
                SelNexa brings records, appointments, telemedicine, and follow-up into one workflow.
                African health teams use it to see more patients, serve them faster, and catch issues before they escalate.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="/contact.html"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-red-600 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Schedule a demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="/features.html"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-red-600 transition-colors"
                >
                  Explore features
                </a>
              </motion.div>

              <p className="mt-4 text-sm text-gray-200">
                Already using the platform?{' '}
                <Link to="/login" className="font-semibold text-white underline underline-offset-4">
                  Sign in
                </Link>
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon
                  return (
                    <motion.div
                      key={point.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <Icon className="h-5 w-5 text-yellow-300" />
                      <h2 className="mt-3 text-sm font-semibold">{point.title}</h2>
                      <p className="mt-2 text-sm text-gray-200">{point.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/70">Operations overview</p>
                    <h2 className="mt-2 text-2xl font-semibold">Ready for real-world care</h2>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Live
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {stats.slice(0, 2).map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/10 p-4">
                      <div className="text-3xl font-bold text-white">{stat.number}</div>
                      <div className="mt-1 text-sm text-gray-200">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-white/10 p-4">
                  <h3 className="text-sm font-semibold text-white">Designed for African healthcare teams</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-200">
                    <li>• Works well on mobile and lower-bandwidth networks</li>
                    <li>• Keeps appointments, records, and follow-up in one workflow</li>
                    <li>• Helps teams move faster without losing visibility</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real benefits for African health teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for how African clinics operate. Works on low bandwidth. Scales from a single clinic to a network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {outcomes.map((outcome, index) => {
              const Icon = outcome.icon
              return (
                <motion.div
                  key={outcome.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{outcome.title}</h3>
                  <p className="text-gray-600">{outcome.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Innovative Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A focused set of tools that help providers manage care without adding complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start serving more patients tomorrow.
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-100">
            See what better scheduling, cleaner records, and telemedicine can do for your team. Demo takes 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact.html"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Schedule a demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/features.html"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              See the features
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
