"use client"

import { useAuth } from "@/lib/auth-context"
import { PatientDashboard } from "@/components/patient/patient-dashboard"
import { DoctorDashboard } from "@/components/doctor/doctor-dashboard"
import { MarketingLanding } from "@/components/marketing-landing"

export default function Home() {
  const { isAuthenticated, role, loading } = useAuth()

  // Aguarda verificação do token antes de renderizar qualquer coisa
  if (loading) return null

  if (!isAuthenticated) {
    return <MarketingLanding />
  }

  if (role === "patient") {
    return <PatientDashboard />
  }

  if (role === "doctor") {
    return <DoctorDashboard />
  }

  return null
}