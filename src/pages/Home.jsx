import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  PlayCircle,
  Shield,
  Smartphone,
  Users,
} from 'lucide-react'

const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    let frameId
    const duration = 1200
    const start = performance.now()

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(value * progress)
      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [started, value])

  const formattedValue = Number.isInteger(value)
    ? Math.round(display).toLocaleString()
    : display.toFixed(1)

  return (
    <span ref={ref}>
      {formattedValue}
      {suffix}
    </span>
  )
}

const Sparkline = ({ points }) => {
  if (!points?.length) return null
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const path = points
    .map(
      (point, index) =>
        `${(index / (points.length - 1)) * 100},${100 - ((point - min) / range) * 100}`
    )
    .join(' ')

  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full">
      <polyline
        fill="none"
        stroke="rgb(239 68 68)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={path}
      />
    </svg>
  )
}

const Home = () => {
  const [demoIndex, setDemoIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [trustTick, setTrustTick] = useState(0)
  const [activeCtaKey, setActiveCtaKey] = useState('hero')
  const [roiInputs, setRoiInputs] = useState({
    dailyPatients: 45,
    noShowRate: 18,
    adminHours: 6,
  })

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
    { value: 10000, suffix: '+', label: 'Patients Served', trend: [12, 20, 18, 26, 35, 44, 56] },
    { value: 500, suffix: '+', label: 'Healthcare Providers', trend: [8, 10, 15, 18, 23, 29, 35] },
    { value: 50, suffix: '+', label: 'Medical Facilities', trend: [4, 7, 10, 14, 18, 23, 28] },
    { value: 99.9, suffix: '%', label: 'Uptime Reliability', trend: [96, 97, 98, 98.5, 99, 99.4, 99.9] }
  ]

  const trustBadgeTemplates = [
    {
      icon: Globe,
      title: 'Low-bandwidth ready',
      description: 'Built to stay usable on slower connections and mobile devices.',
      metrics: ['2G/3G optimized', 'Fast on mobile', 'Offline fallback']
    },
    {
      icon: Shield,
      title: 'Secure by design',
      description: 'Clear workflows for keeping clinical data protected and auditable.',
      metrics: ['Audit logs on', 'Encrypted in transit', 'Role-based access']
    },
    {
      icon: Activity,
      title: 'Built for care teams',
      description: 'Tools that reduce manual work and keep teams moving.',
      metrics: ['Live queue updates', 'Automated reminders', 'Rapid follow-up']
    }
  ]

  const clinicJourney = [
    {
      icon: Calendar,
      step: '01',
      title: 'Intake and triage',
      description: 'Patients are registered once, triaged quickly, and routed to the right team without queue confusion.',
      highlight: 'Less front-desk bottleneck'
    },
    {
      icon: Brain,
      step: '02',
      title: 'Diagnosis and treatment',
      description: 'Clinicians get AI-assisted context, complete records, and clear next actions during consultation.',
      highlight: 'Faster decision-making'
    },
    {
      icon: Heart,
      step: '03',
      title: 'Follow-up and continuity',
      description: 'Remote monitoring, reminders, and telemedicine sessions keep patients connected beyond the visit.',
      highlight: 'Better long-term outcomes'
    }
  ]

  const outcomes = [
    {
      icon: Calendar,
      title: 'See 20% more patients',
      description:
        'Eliminate scheduling friction and double-booking. Appointment workflows handle edge cases so staff do less manual work.'
    },
    {
      icon: Shield,
      title: 'Keep records audit-ready',
      description:
        'Automatic timestamps and access logs keep compliance built in, so reporting for donors and regulators is straightforward.'
    },
    {
      icon: Heart,
      title: "Don't lose patients to follow-up",
      description:
        'Automated reminders and telemedicine make it easier for patients to stay engaged between visits.'
    }
  ]

  const productDemos = [
    {
      title: 'Dashboard command center',
      subtitle: 'Track visits, queue pressure, and urgent cases in one view.',
      bullets: ['Live patient flow', 'Team workload signals', 'Priority alerts']
    },
    {
      title: 'Appointments and no-show control',
      subtitle: 'Automate reminders and rebalance schedules before bottlenecks build up.',
      bullets: ['Smart reminders', 'No-show risk flags', 'Quick rebooking']
    },
    {
      title: 'Telemedicine follow-up',
      subtitle: 'Run virtual consults and capture follow-up actions without switching tools.',
      bullets: ['Secure virtual room', 'Shared notes', 'One-click follow-up']
    }
  ]

  const testimonials = [
    {
      quote:
        'SelNexa cut our waiting-room congestion in weeks. Our team now spends more time with patients and less time untangling admin.',
      name: 'Dr. Nyasha M.',
      role: 'Medical Director',
      org: 'Harare Community Clinic'
    },
    {
      quote:
        'Follow-up adherence improved because reminders and telemedicine are finally in one workflow. We can see who needs attention sooner.',
      name: 'Sr. Tendai K.',
      role: 'Clinical Operations Lead',
      org: 'Bulawayo Family Health Network'
    },
    {
      quote:
        'The dashboard gave us a real-time picture of staffing and patient flow. It helped us reduce service delays during peak hours.',
      name: 'Blessing T.',
      role: 'Hospital Administrator',
      org: 'Mutare District Facility'
    }
  ]

  const ctaMap = {
    hero: { label: 'Schedule a demo', href: '/contact.html' },
    story: { label: 'See clinic journey', href: '#clinic-day' },
    demo: { label: 'Explore product flow', href: '#product-demo' },
    roi: { label: 'Calculate your ROI', href: '#roi-calculator' },
    testimonials: { label: 'Read success stories', href: '#testimonials' },
    final: { label: 'Talk to sales', href: '/contact.html' }
  }

  const trustBadges = useMemo(
    () =>
      trustBadgeTemplates.map((badge, index) => ({
        ...badge,
        metric: badge.metrics[(trustTick + index) % badge.metrics.length]
      })),
    [trustBadgeTemplates, trustTick]
  )

  const roiResults = useMemo(() => {
    const monthlyVisits = roiInputs.dailyPatients * 22
    const recoveredNoShows = Math.round(monthlyVisits * (roiInputs.noShowRate / 100) * 0.35)
    const monthlyHoursSaved = Math.round(roiInputs.adminHours * 22 * 0.3)
    const visitsFromTimeSavings = Math.round(monthlyHoursSaved * 0.6)
    const additionalVisits = recoveredNoShows + visitsFromTimeSavings

    return {
      additionalVisits,
      annualAdditionalVisits: additionalVisits * 12,
      monthlyHoursSaved
    }
  }, [roiInputs])

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % productDemos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [productDemos.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setTrustTick((prev) => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-cta-key]'))
    if (!sections.length) return

    const visibility = {}

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute('data-cta-key')
          if (!key) return
          visibility[key] = entry.isIntersecting ? entry.intersectionRatio : 0
        })

        let bestKey = 'hero'
        let bestScore = 0
        Object.entries(visibility).forEach(([key, score]) => {
          if (score > bestScore) {
            bestKey = key
            bestScore = score
          }
        })

        if (bestScore > 0) setActiveCtaKey(bestKey)
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-20% 0px -45% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const activeCta = ctaMap[activeCtaKey] || ctaMap.hero

  const updateRoiInput = (field, value) => {
    setRoiInputs((prev) => ({ ...prev, [field]: Number(value) }))
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.a
        href={activeCta.href}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-6 right-6 z-40 hidden md:inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-red-700"
      >
        {activeCta.label}
        <ArrowRight className="h-4 w-4" />
      </motion.a>

      {/* Hero Section */}
      <section data-cta-key="hero" className="relative overflow-hidden gradient-bg text-white">
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
                <motion.a
                  href="/contact.html"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-white px-8 py-4 font-semibold text-red-600 transition-colors hover:bg-gray-100"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-red-100 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative inline-flex items-center">
                    Schedule a demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </motion.a>
                <motion.a
                  href="/features.html"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-red-600"
                >
                  Explore features
                </motion.a>
              </motion.div>

              <p className="mt-4 text-sm text-gray-200">
                Already using the platform?{' '}
                <Link to="/login" className="font-semibold text-white underline underline-offset-4">
                  Sign in
                </Link>
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {trustBadges.map((point, index) => {
                  const Icon = point.icon
                  return (
                    <motion.div
                      key={point.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <Icon className="h-5 w-5 text-yellow-300" />
                      <h2 className="mt-3 text-sm font-semibold">{point.title}</h2>
                      <p className="mt-2 text-sm text-gray-200">{point.description}</p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100 animate-pulse">
                        {point.metric}
                      </div>
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
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
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

      {/* Day in Clinic Story */}
      <section id="clinic-day" data-cta-key="story" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">A day in the clinic, powered by SelNexa</h2>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600">
              Follow the patient journey from intake to follow-up with a smoother, connected workflow.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {clinicJourney.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="card relative"
                >
                  <span className="absolute right-4 top-4 text-xs font-bold tracking-[0.2em] text-red-300">
                    STEP {step.step}
                  </span>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-gray-600">{step.description}</p>
                  <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {step.highlight}
                  </p>
                </motion.article>
              )
            })}
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
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600">{stat.label}</div>
                <div className="mx-auto mt-2 max-w-[120px]">
                  <Sparkline points={stat.trend} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Product Demo Strip */}
      <section id="product-demo" data-cta-key="demo" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Live product flow</h2>
            <p className="mt-4 text-xl text-gray-600">
              A rotating look at how teams coordinate care, operations, and follow-up without tool switching.
            </p>
            <div className="mt-8 space-y-3">
              {productDemos.map((panel, index) => (
                <button
                  key={panel.title}
                  onClick={() => setDemoIndex(index)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    demoIndex === index
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-red-100 hover:bg-red-50/40'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{panel.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{panel.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={productDemos[demoIndex].title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-gray-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Product preview</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                  <PlayCircle className="h-4 w-4 text-red-500" />
                  Auto rotating
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">{productDemos[demoIndex].title}</h3>
              <p className="mt-2 text-gray-600">{productDemos[demoIndex].subtitle}</p>
              <div className="mt-6 grid gap-3">
                {productDemos[demoIndex].bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2 rounded-xl bg-white p-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-700">{bullet}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
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
                  whileHover={{ y: -6 }}
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
                  whileHover={{ y: -6 }}
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

      {/* Testimonials Carousel */}
      <section id="testimonials" data-cta-key="testimonials" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What care teams are saying</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
              Real stories from clinicians and administrators using SelNexa in day-to-day operations.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[testimonialIndex].name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-2xl leading-relaxed text-gray-800">
                  “{testimonials[testimonialIndex].quote}”
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">{testimonials[testimonialIndex].name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonials[testimonialIndex].role} • {testimonials[testimonialIndex].org}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.name}
                    onClick={() => setTestimonialIndex(index)}
                    className={`h-2.5 w-8 rounded-full transition-colors ${
                      testimonialIndex === index ? 'bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className="rounded-full border border-gray-300 p-2 text-gray-600 transition-colors hover:border-red-200 hover:text-red-600"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                  className="rounded-full border border-gray-300 p-2 text-gray-600 transition-colors hover:border-red-200 hover:text-red-600"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi-calculator" data-cta-key="roi" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Interactive ROI snapshot</h2>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600">
              Adjust your numbers to estimate the operational impact SelNexa can make.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Average patients per day</span>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={roiInputs.dailyPatients}
                  onChange={(event) => updateRoiInput('dailyPatients', event.target.value)}
                  className="input mt-2"
                />
              </label>

              <label className="mt-5 block">
                <span className="text-sm font-semibold text-gray-700">No-show rate (%)</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={roiInputs.noShowRate}
                  onChange={(event) => updateRoiInput('noShowRate', event.target.value)}
                  className="mt-2 w-full accent-red-600"
                />
                <p className="mt-1 text-sm text-gray-600">{roiInputs.noShowRate}%</p>
              </label>

              <label className="mt-5 block">
                <span className="text-sm font-semibold text-gray-700">Admin hours per day</span>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={roiInputs.adminHours}
                  onChange={(event) => updateRoiInput('adminHours', event.target.value)}
                  className="mt-2 w-full accent-red-600"
                />
                <p className="mt-1 text-sm text-gray-600">{roiInputs.adminHours} hours</p>
              </label>
            </div>

            <div className="card bg-gradient-to-br from-white to-red-50">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Estimated monthly impact</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-sm text-gray-600">Additional patient visits</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">
                    {roiResults.additionalVisits.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-sm text-gray-600">Admin hours saved</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">
                    {roiResults.monthlyHoursSaved.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 sm:col-span-2">
                  <p className="text-sm text-gray-600">Potential annual additional visits</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">
                    {roiResults.annualAdditionalVisits.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm text-gray-600">
                Estimate based on reminder automation, improved scheduling, and administrative time recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-cta-key="final" className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start serving more patients tomorrow.
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-100">
            See what better scheduling, cleaner records, and telemedicine can do for your team. Demo takes 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/contact.html"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-white px-8 py-4 font-semibold text-red-600 transition-colors hover:bg-gray-100"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-red-100 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative inline-flex items-center">
                Schedule a demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </motion.a>
            <motion.a
              href="/features.html"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-red-600"
            >
              See the features
            </motion.a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-gray-100">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-yellow-300" />
              Built for frontline teams
            </span>
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-300" />
              Secure workflows
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-yellow-300" />
              Mobile-first delivery
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
