"use client"

import { useAuth } from "@/lib/auth-context"
import { PatientDashboard } from "@/components/patient/patient-dashboard"
import { DoctorDashboard } from "@/components/doctor/doctor-dashboard"
import Navbar from "@/components/sections/Navbar"
import HeroSection from "@/components/sections/HeroSection"
import ProblemSection from "@/components/sections/ProblemSection"
import FeaturesSection from "@/components/sections/FeaturesSection"
import DoctorsSection from "@/components/sections/DoctorsSection"
import UsersSection from "@/components/sections/UsersSection"
import SecuritySection from "@/components/sections/SecuritySection"
import DifferentialsSection from "@/components/sections/DifferentialsSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import CTASection from "@/components/sections/CTASection"
import Footer from "@/components/sections/Footer"

export default function Home() {
  const { isAuthenticated, role, loading } = useAuth()

  // Aguarda verificação do token antes de renderizar qualquer coisa
  if (loading) return null

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <DoctorsSection />
        <UsersSection />
        <SecuritySection />
        <DifferentialsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    )
  }

  if (role === "patient") {
    return <PatientDashboard />
  }

  if (role === "doctor") {
    return <DoctorDashboard />
  }

  return null
}