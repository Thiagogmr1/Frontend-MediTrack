"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, Flame, AlertTriangle, Calendar, Plus, Phone, Clock, Trash2, Pill, 
ChevronDown, ChevronUp, FileText, Eye, Pencil, PauseCircle, X, RotateCcw, Repeat, PlayCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Patient } from "./doctor-dashboard"
import { MedicationAutocomplete } from "@/components/doctor/medication-autocomplete"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface PatientDashboard {
  patient_name: string
  patient_phone: string | null
  patient_age: number | null
  total_doses: number
  taken_doses: number
  general_adherence: number
  missed_doses: number
  consecutive_days: number
  daily_adherence: { date: string; total_doses: number; taken_doses: number; adherence: number }[]
  weekly_adherence: { week: string; total_doses: number; taken_doses: number; adherence: number }[]
  medication_adherence: { medication_id: number; name: string; scheduled_time: string; total_doses: number; taken_doses: number; adherence: number }[]
}

interface DoctorPatientDetailProps {
  patient: Patient
  onBack: () => void
}

interface MedicationSchedule {
  scheduled_time: string
}

interface MedicationForm {
  id: string
  name: string
  dosage: string
  indication: string
  notes: string
  start_date: string
  end_date: string
  continuous_use: boolean
  frequency: string
  schedules: MedicationSchedule[]
}

interface MedicationDetail {
  medication_id: number
  name: string
  dosage: string
  indication: string | null
  notes: string | null
  start_date: string
  end_date: string | null
  continuous_use: boolean
  weekly: boolean
  frequency: string | null
  status: string
  schedules: string[]
}

interface PrescriptionSummary {
  prescription_id: number
  notes: string | null
  status: string
  created_at: string
  total_medications: number
  has_continuous: boolean
  latest_end_date: string | null
  latest_scheduled_time: string | null
  medication_names: string[]
}

interface PrescriptionDetail {
  prescription_id: number
  notes: string | null
  status: string
  created_at: string
  patient_id: number
  medications: MedicationDetail[]
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function createEmptyMedication(): MedicationForm {
  return {
    id: crypto.randomUUID(),
    name: "",
    dosage: "",
    indication: "",
    notes: "",
    start_date: "",
    end_date: "",
    continuous_use: false,
    frequency: "",
    schedules: [{ scheduled_time: "" }],
  }
}

function isCompleted(p: Pick<PrescriptionSummary, "status" | "has_continuous" | "latest_end_date" | "latest_scheduled_time">): boolean {
  if (p.status !== "active") return false
  if (p.has_continuous) return false
  if (!p.latest_end_date || !p.latest_scheduled_time) return false

  const [year, month, day] = p.latest_end_date.split("-").map(Number)
  const [hours, minutes] = p.latest_scheduled_time.split(":").map(Number)

  const lastDose = new Date(year, month - 1, day, hours, minutes, 0)
  return lastDose < new Date()
}

function statusBadge(status: string, p?: Pick<PrescriptionSummary, "status" | "has_continuous" | "latest_end_date" | "latest_scheduled_time">) {
  if (p && isCompleted(p)) {
    return <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 hover:bg-blue-500/15">Concluída</Badge>
  }
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/15">Ativa</Badge>
    case "suspended":
      return <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/15">Suspensa</Badge>
    case "ended":
      return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted">Encerrada</Badge>
    default:
      return null
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  // Se vier só a data (YYYY-MM-DD), adiciona horário para evitar interpretação UTC
  const normalized = dateStr.length === 10 ? `${dateStr}T00:00:00` : dateStr
  const date = new Date(normalized)
  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
}

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export function DoctorPatientDetail({ patient, onBack }: DoctorPatientDetailProps) {
  const { token, user } = useAuth()
  const [prescriptionOpen, setPrescriptionOpen] = useState(false)
  const [dashboard, setDashboard] = useState<PatientDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/patient/${patient.patient_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
        setDashboard(data)
      } catch {
        toast.error("Erro ao carregar dados do paciente")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [patient.patient_id, token])

  const annualCalendar = (() => {
    const today = new Date()
    const months: { month: number; year: number; days: { dateStr: string; percentage: number }[] }[] = []

    const firstDate = (dashboard?.daily_adherence?.length ?? 0) > 0
      ? new Date(dashboard!.daily_adherence[0].date)
      : today

    const start = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth(), 1)

    while (start <= end) {
      const year = start.getFullYear()
      const month = start.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const days = []

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
        const found = dashboard?.daily_adherence.find((da) => da.date === dateStr)
        days.push({ dateStr, percentage: found?.adherence ?? -1 })
      }

      months.push({ month, year, days })
      start.setMonth(start.getMonth() + 1)
    }

    return months
  })()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!dashboard) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-semibold">
              {dashboard.patient_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{dashboard.patient_name}</h1>
              <p className="text-sm text-muted-foreground">
                {dashboard.patient_age ? `${dashboard.patient_age} anos` : "Idade não informada"}
              </p>
            </div>
          </div>
        </div>
        <Dialog open={prescriptionOpen} onOpenChange={setPrescriptionOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Prescrever</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Nova Prescrição</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Preencha os medicamentos e horários para {dashboard.patient_name}
              </DialogDescription>
            </DialogHeader>
            <PrescriptionForm
              doctorId={user?.user_id!}
              patientId={patient.patient_id}
              token={token!}
              onSave={() => {
                setPrescriptionOpen(false)
                toast.success("Prescrição criada com sucesso!")
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Patient Info */}
      {dashboard.patient_phone && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />
          <span>
            {`(${dashboard.patient_phone.slice(0, 2)}) ${dashboard.patient_phone.slice(2)}`}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dashboard.general_adherence}%</p>
                <p className="text-xs text-muted-foreground">Adesão geral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {dashboard.weekly_adherence.length > 0
                    ? dashboard.weekly_adherence[dashboard.weekly_adherence.length - 1].adherence
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Semana atual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dashboard.missed_doses}</p>
                <p className="text-xs text-muted-foreground">Doses perdidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
                <Flame className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dashboard.consecutive_days}</p>
                <p className="text-xs text-muted-foreground">Dias seguidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescrições</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        {/* ── Visão Geral ── */}
        <TabsContent value="overview" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Adesão Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboard.weekly_adherence}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <RechartsTooltip
                      formatter={(value: number) => [`${value}%`, "Adesão"]}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="adherence" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: "var(--chart-2)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Tendência de Adesão — 30 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboard.daily_adherence}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <RechartsTooltip
                      formatter={(value: number) => [`${value}%`, "Adesão"]}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="adherence" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Prescrições ── */}
        <TabsContent value="prescriptions" className="mt-4">
          <PrescriptionList
            doctorId={user?.user_id!}
            patientId={patient.patient_id}
            token={token!}
          />
        </TabsContent>

        {/* ── Calendário ── */}
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold">Adesão recente</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Desde o início do tratamento</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { label: "100%", color: "bg-[#1D9E75]" },
                    { label: "50–99%", color: "bg-[#EF9F27]" },
                    { label: "<50%", color: "bg-destructive" },
                    { label: "Sem dados", color: "bg-muted border border-border/60" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[11px] text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {annualCalendar.map((m) => (
                <div key={`${m.year}-${m.month}`} className="flex items-start gap-4">
                  <div className="w-10 shrink-0 pt-1">
                    <p className="text-xs font-semibold text-foreground">{MONTHS_SHORT[m.month]}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.year}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-1">
                    {m.days.map((day) => {
                      let bg = "bg-muted border border-border/50"
                      if (day.percentage === 100) bg = "bg-[#1D9E75]"
                      else if (day.percentage >= 50) bg = "bg-[#EF9F27]"
                      else if (day.percentage >= 0) bg = "bg-destructive"
                      return (
                        <Tooltip key={day.dateStr}>
                          <TooltipTrigger asChild>
                            <div className={`h-5 flex-1 min-w-[10px] rounded-sm transition-all duration-150 hover:opacity-80 ${bg}`} />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">
                              {day.dateStr.split("-").reverse().join("/")}
                              {" • "}
                              {day.percentage >= 0 ? `${day.percentage}%` : "Sem dados"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Adesão por medicamento */}
          {dashboard.medication_adherence && dashboard.medication_adherence.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  Adesão por medicamento
                  {dashboard.medication_adherence?.some((m) => m.total_doses > 0 && m.adherence < 50) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Acompanhe a adesão de cada medicamento</p>
              </CardHeader>
              <CardContent>
                {dashboard.medication_adherence.length <= 3 ? (
                  <div className="space-y-2">
                    {dashboard.medication_adherence.map((med) => (
                      <MedicationAdherenceRow key={`${med.medication_id}-${med.scheduled_time}`} med={med} />
                    ))}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="medications" className="border-none">
                        <AccordionTrigger className="py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground 
                        hover:bg-accent hover:text-foreground hover:no-underline transition-all duration-200 cursor-pointer [&>svg]:size-5">
                        Ver todos os {dashboard.medication_adherence.length} medicamentos
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-5 pt-1">
                          {dashboard.medication_adherence.map((med) => (
                            <MedicationAdherenceRow key={`${med.medication_id}-${med.scheduled_time}`} med={med} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          )}

        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PRESCRIPTION LIST
// ─────────────────────────────────────────────────────────────

function PrescriptionList({
  doctorId,
  patientId,
  token,
}: {
  doctorId: number
  patientId: number
  token: string
}) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [viewTarget, setViewTarget] = useState<PrescriptionDetail | null>(null)
  const [editTarget, setEditTarget] = useState<PrescriptionDetail | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: "suspend" | "delete" | "reactivate"; id: number } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  async function fetchList() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/doctor/${doctorId}/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setPrescriptions(data)
    } catch {
      toast.error("Erro ao carregar prescrições")
    } finally {
      setLoading(false)
    }
  }

  async function fetchDetail(prescriptionId: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${prescriptionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.json() as Promise<PrescriptionDetail>
  }

  async function handleView(prescriptionId: number) {
    try {
      const detail = await fetchDetail(prescriptionId)
      setViewTarget(detail)
    } catch {
      toast.error("Erro ao carregar prescrição")
    }
  }

  async function handleEdit(prescriptionId: number) {
    try {
      const detail = await fetchDetail(prescriptionId)
      setEditTarget(detail)
    } catch {
      toast.error("Erro ao carregar prescrição")
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction) return
    setActionLoading(true)
    try {
      const method = confirmAction.type === "delete" ? "DELETE" : "PATCH"
      const url =
        confirmAction.type === "suspend"
          ? `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${confirmAction.id}/suspend`
          : confirmAction.type === "reactivate"
            ? `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${confirmAction.id}/reactivate`
            : `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${confirmAction.id}`

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.detail || "Erro na operação")
        return
      }

      const messages = {
        suspend: "Prescrição suspensa",
        reactivate: "Prescrição reativada",
        delete: "Prescrição encerrada",
      }
      toast.success(messages[confirmAction.type])
      setConfirmAction(null)
      fetchList()
    } catch {
      toast.error("Erro na operação")
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => { fetchList() }, [doctorId, patientId])

  if (loading) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Carregando prescrições...</p>
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-2 text-center">
          <FileText className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">Nenhuma prescrição encontrada</p>
          <p className="text-xs text-muted-foreground">Use o botão "Prescrever" para criar a primeira</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {prescriptions.map((p) => (
          <Card
            key={p.prescription_id}
            className="border-border cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:bg-muted/30"
            onClick={() => handleView(p.prescription_id)}
          >
            <CardContent className="pt-2 pb-2">
              <div className="flex items-start justify-between gap-4">

                {/* Informações principais */}
                <div className="flex flex-col gap-4 min-w-0">
                  {/* Status + Data */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {statusBadge(p.status, p)}
                    <span className="text-xs text-muted-foreground">
                      Início: {formatDate(p.created_at)}
                    </span>
                  </div>

                  {/* Nomes dos medicamentos */}
                  <div className="flex flex-wrap gap-1.5">
                    {[...new Set(p.medication_names)].map((name, index) => (
                      <span
                        key={`${name}-${index}`}
                        className="inline-flex items-center gap-1 text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full border border-primary/15"
                      >
                        <Pill className="w-3 h-3" />
                        {name}
                      </span>
                    ))}
                  </div>

                  {/* Total */}

                </div>

                {/* Botões — stopPropagation para não abrir modal */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {p.status === "active" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p.prescription_id)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-yellow-600 hover:bg-yellow-500/10"
                            onClick={() => setConfirmAction({ type: "suspend", id: p.prescription_id })}
                          >
                            <PauseCircle className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Suspender</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setConfirmAction({ type: "delete", id: p.prescription_id })}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Encerrar</TooltipContent>
                      </Tooltip>
                    </>
                  )}

                  {p.status === "suspended" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10"
                            onClick={() => setConfirmAction({ type: "reactivate", id: p.prescription_id })}
                          >
                            <PlayCircle className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reativar</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setConfirmAction({ type: "delete", id: p.prescription_id })}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Encerrar</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>   

      {/* Modal: Visualizar */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Prescrição</DialogTitle>
            <DialogDescription>
              Criada em {viewTarget && formatDate(viewTarget.created_at)}
              {" · "}
              {viewTarget && statusBadge(viewTarget.status)}
            </DialogDescription>
          </DialogHeader>
          {viewTarget && <PrescriptionDetailView prescription={viewTarget} />}
        </DialogContent>
      </Dialog>

      {/* Modal: Editar */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Prescrição</DialogTitle>
            <DialogDescription>Alterações nos horários recriam as doses futuras automaticamente.</DialogDescription>
          </DialogHeader>
          {editTarget && (
            <PrescriptionEditForm
              prescription={editTarget}
              token={token}
              onSave={() => {
                setEditTarget(null)
                toast.success("Prescrição atualizada")
                fetchList()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar ação */}
      <Dialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "suspend"
                ? "Suspender prescrição?"
                : confirmAction?.type === "reactivate"
                  ? "Reativar prescrição?"
                  : "Encerrar prescrição?"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "suspend"
                ? "Os alertas do paciente serão pausados. O histórico de doses é preservado."
                : confirmAction?.type === "reactivate"
                  ? "A prescrição voltará a ficar ativa. Novas doses serão geradas a partir de hoje, o período suspenso não será contabilizado."
                  : "A prescrição será encerrada. O histórico médico é preservado e não pode ser desfeito."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmAction(null)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              className={`flex-1 ${confirmAction?.type === "delete"
                ? "bg-destructive hover:bg-destructive/90"
                : confirmAction?.type === "reactivate"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Aguarde..."
                : confirmAction?.type === "suspend"
                  ? "Suspender"
                  : confirmAction?.type === "reactivate"
                    ? "Reativar"
                    : "Encerrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// PRESCRIPTION DETAIL VIEW (somente leitura)
// ─────────────────────────────────────────────────────────────

function PrescriptionDetailView({ prescription }: { prescription: PrescriptionDetail }) {
  return (
    <div className="space-y-4">
      {prescription.notes && (
        <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
          {prescription.notes}
        </div>
      )}

      <div className="space-y-3">
        {prescription.medications.map((med) => (
          <Card key={med.medication_id} className="border-border">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium text-sm text-foreground">{med.name}</span>
                  <span className="text-xs text-muted-foreground">{med.dosage}</span>
                </div>
                {statusBadge(med.status)}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Início: </span>
                  <span className="text-foreground">{formatDate(med.start_date)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fim: </span>
                  <span className="text-foreground">
                    {med.continuous_use ? (
                      <span className="flex items-center gap-1 inline-flex">
                        <Repeat className="w-3 h-3 text-primary" /> Uso contínuo
                      </span>
                    ) : med.end_date ? formatDate(med.end_date) : "—"}
                  </span>
                </div>
                {med.indication && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Indicação: </span>
                    <span className="text-foreground">{med.indication}</span>
                  </div>
                )}
                {med.notes && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Obs: </span>
                    <span className="text-foreground">{med.notes}</span>
                  </div>
                )}
                {med.frequency && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Frequência: </span>
                    <span className="text-foreground">{med.frequency}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                {med.schedules.map((s) => (
                  <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PRESCRIPTION EDIT FORM
// ─────────────────────────────────────────────────────────────

function PrescriptionEditForm({
  prescription,
  token,
  onSave,
}: {
  prescription: PrescriptionDetail
  token: string
  onSave: () => void
}) {
  const [notes, setNotes] = useState(prescription.notes ?? "")
  const [medications, setMedications] = useState<MedicationForm[]>(
    prescription.medications.map((m) => ({
      id: String(m.medication_id),
      name: m.name,
      dosage: m.dosage,
      indication: m.indication ?? "",
      notes: m.notes ?? "",
      start_date: m.start_date,
      end_date: m.end_date ?? "",
      continuous_use: m.continuous_use,
      weekly: m.weekly ?? false,
      frequency: m.frequency ?? "",
      schedules: m.schedules.map((s) => ({ scheduled_time: s })),
    }))
  )
  const [collapsedMeds, setCollapsedMeds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  function updateMedication(id: string, field: keyof MedicationForm, value: string | boolean) {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  function toggleCollapse(id: string) {
    setCollapsedMeds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function addSchedule(medId: string) {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId ? { ...m, schedules: [...m.schedules, { scheduled_time: "" }] } : m
      )
    )
  }

  function updateSchedule(medId: string, index: number, value: string) {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m
        const schedules = [...m.schedules]
        schedules[index] = { scheduled_time: value }
        return { ...m, schedules }
      })
    )
  }

  function removeSchedule(medId: string, index: number) {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m
        if (m.schedules.length === 1) {
          toast.error("O medicamento deve ter ao menos um horário")
          return m
        }
        return { ...m, schedules: m.schedules.filter((_, i) => i !== index) }
      })
    )
  }

  async function handleSubmit() {
    for (const med of medications) {
      if (!med.name || !med.dosage || !med.start_date) {
        toast.error(`Preencha todos os campos obrigatórios de "${med.name || "sem nome"}"`)
        return
      }
      if (!med.continuous_use && !med.end_date) {
        toast.error(`Informe a data de fim de "${med.name}" ou marque uso contínuo`)
        return
      }
      for (const s of med.schedules) {
        if (!s.scheduled_time) {
          toast.error(`Preencha todos os horários de "${med.name}"`)
          return
        }
      }
    }

    setLoading(true)
    try {
      const body = {
        notes: notes || null,
        medications: medications.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          indication: m.indication || null,
          notes: m.notes || null,
          start_date: m.start_date,
          end_date: m.continuous_use ? null : m.end_date,
          continuous_use: m.continuous_use,
          frequency: m.frequency || null,
          schedules: m.schedules,
        })),
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${prescription.prescription_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.detail || "Erro ao atualizar prescrição")
        return
      }

      onSave()
    } catch {
      toast.error("Erro ao atualizar prescrição")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Observações gerais</Label>
        <Textarea
          placeholder="Instruções gerais da prescrição (opcional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-3">
        {medications.map((med, medIndex) => {
          const isCollapsed = collapsedMeds.has(med.id)
          return (
            <Card key={med.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Pill className="w-4 h-4 text-primary" />
                    {med.name ? `${med.name}${med.dosage ? ` — ${med.dosage}` : ""}` : `Medicamento ${medIndex + 1}`}
                  </CardTitle>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => toggleCollapse(med.id)}
                  >
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>

              {!isCollapsed && (
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome <span className="text-destructive">*</span></Label>
                      <Input value={med.name} onChange={(e) => updateMedication(med.id, "name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Dosagem <span className="text-destructive">*</span></Label>
                      <Input value={med.dosage} onChange={(e) => updateMedication(med.id, "dosage", e.target.value)} />
                    </div>
                  </div>

                  {/* Uso contínuo toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateMedication(med.id, "continuous_use", !med.continuous_use)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${med.continuous_use
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                        }`}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      Uso contínuo
                    </button>
                    {med.continuous_use && (
                      <span className="text-xs text-muted-foreground">Sem data de fim</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Data de início <span className="text-destructive">*</span></Label>
                      <Input type="date" value={med.start_date} onChange={(e) => updateMedication(med.id, "start_date", e.target.value)} />
                    </div>
                    {!med.continuous_use && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Data de fim <span className="text-destructive">*</span></Label>
                        <Input type="date" value={med.end_date} min={med.start_date} onChange={(e) => updateMedication(med.id, "end_date", e.target.value)} />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Indicação de uso</Label>
                      <Input placeholder="Ex: Em jejum" value={med.indication} onChange={(e) => updateMedication(med.id, "indication", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Frequência</Label>
                      <Input placeholder="Ex: A cada 8 horas" value={med.frequency} onChange={(e) => updateMedication(med.id, "frequency", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Observações</Label>
                    <Input placeholder="Ex: Evitar com álcool" value={med.notes} onChange={(e) => updateMedication(med.id, "notes", e.target.value)} />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      Horários <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {med.schedules.map((schedule, schedIndex) => (
                        <div key={schedIndex} className="flex items-center gap-1">
                          <Input
                            type="time"
                            value={schedule.scheduled_time}
                            onChange={(e) => updateSchedule(med.id, schedIndex, e.target.value)}
                            className="w-32"
                          />
                          {med.schedules.length > 1 && (
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeSchedule(med.id, schedIndex)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline" size="sm"
                        className="gap-1 h-9 text-primary border-primary/30 hover:bg-primary/5"
                        onClick={() => addSchedule(med.id)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Horário
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PRESCRIPTION FORM (criar nova — mantido + continuous_use)
// ─────────────────────────────────────────────────────────────

function PrescriptionForm({
  doctorId,
  patientId,
  token,
  onSave,
}: {
  doctorId: number
  patientId: number
  token: string
  onSave: () => void
}) {
  const [prescriptionNotes, setPrescriptionNotes] = useState("")
  const [medications, setMedications] = useState<MedicationForm[]>([createEmptyMedication()])
  const [collapsedMeds, setCollapsedMeds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  function updateMedication(id: string, field: keyof MedicationForm, value: string | boolean) {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  function addMedication() {
    setMedications((prev) => [...prev, createEmptyMedication()])
  }

  function removeMedication(id: string) {
    if (medications.length === 1) {
      toast.error("A prescrição deve ter ao menos um medicamento")
      return
    }
    setMedications((prev) => prev.filter((m) => m.id !== id))
    setCollapsedMeds((prev) => { prev.delete(id); return new Set(prev) })
  }

  function toggleCollapse(id: string) {
    setCollapsedMeds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function addSchedule(medId: string) {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId ? { ...m, schedules: [...m.schedules, { scheduled_time: "" }] } : m
      )
    )
  }

  function updateSchedule(medId: string, index: number, value: string) {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m
        const schedules = [...m.schedules]
        schedules[index] = { scheduled_time: value }
        return { ...m, schedules }
      })
    )
  }

  function removeSchedule(medId: string, index: number) {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m
        if (m.schedules.length === 1) {
          toast.error("O medicamento deve ter ao menos um horário")
          return m
        }
        return { ...m, schedules: m.schedules.filter((_, i) => i !== index) }
      })
    )
  }

  async function handleSubmit() {
    for (const med of medications) {
      if (!med.name || !med.dosage || !med.start_date) {
        toast.error(`Preencha todos os campos obrigatórios do medicamento "${med.name || "sem nome"}"`)
        return
      }
      if (!med.continuous_use && !med.end_date) {
        toast.error(`Informe a data de fim de "${med.name}" ou marque uso contínuo`)
        return
      }
      if (!med.continuous_use && med.end_date < med.start_date) {
        toast.error(`A data de fim não pode ser anterior à de início em "${med.name}"`)
        return
      }
      for (const s of med.schedules) {
        if (!s.scheduled_time) {
          toast.error(`Preencha todos os horários do medicamento "${med.name}"`)
          return
        }
      }
    }

    setLoading(true)
    try {
      const body = {
        doctor_id: doctorId,
        patient_id: patientId,
        notes: prescriptionNotes || null,
        medications: medications.map(({ id, ...med }) => ({
          ...med,
          end_date: med.continuous_use ? null : med.end_date,
          indication: med.indication || null,
          notes: med.notes || null,
          frequency: med.frequency || null,
        })),
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.detail || "Erro ao criar prescrição")
        return
      }

      onSave()
    } catch {
      toast.error("Erro ao criar prescrição")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Observações gerais</Label>
        <Textarea
          placeholder="Instruções gerais da prescrição (opcional)"
          value={prescriptionNotes}
          onChange={(e) => setPrescriptionNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-3">
        {medications.map((med, medIndex) => {
          const isCollapsed = collapsedMeds.has(med.id)
          return (
            <Card key={med.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Pill className="w-4 h-4 text-primary" />
                    {med.name ? `${med.name}${med.dosage ? ` — ${med.dosage}` : ""}` : `Medicamento ${medIndex + 1}`}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toggleCollapse(med.id)}>
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => removeMedication(med.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isCollapsed && (
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome <span className="text-destructive">*</span></Label>
                      <MedicationAutocomplete
                        value={med.name}
                        onChange={(value) => updateMedication(med.id, "name", value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Dosagem <span className="text-destructive">*</span></Label>
                      <Input placeholder="Ex: 850mg" value={med.dosage} onChange={(e) => updateMedication(med.id, "dosage", e.target.value)} />
                    </div>
                  </div>

                  {/* Uso contínuo toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateMedication(med.id, "continuous_use", !med.continuous_use)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${med.continuous_use
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                        }`}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      Uso contínuo
                    </button>
                    {med.continuous_use && (
                      <span className="text-xs text-muted-foreground">Sem data de fim</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Data de início <span className="text-destructive">*</span></Label>
                      <Input type="date" value={med.start_date} onChange={(e) => updateMedication(med.id, "start_date", e.target.value)} />
                    </div>
                    {!med.continuous_use && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Data de fim <span className="text-destructive">*</span></Label>
                        <Input type="date" value={med.end_date} min={med.start_date} onChange={(e) => updateMedication(med.id, "end_date", e.target.value)} />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Indicação de uso</Label>
                      <Input placeholder="Ex: Em jejum, com água" value={med.indication} onChange={(e) => updateMedication(med.id, "indication", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Observações</Label>
                      <Input placeholder="Ex: Evitar com álcool" value={med.notes} onChange={(e) => updateMedication(med.id, "notes", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      Horários <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {med.schedules.map((schedule, schedIndex) => (
                        <div key={schedIndex} className="flex items-center gap-1">
                          <Input
                            type="time"
                            value={schedule.scheduled_time}
                            onChange={(e) => updateSchedule(med.id, schedIndex, e.target.value)}
                            className="w-32"
                          />
                          {med.schedules.length > 1 && (
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeSchedule(med.id, schedIndex)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline" size="sm"
                        className="gap-1 h-9 text-primary border-primary/30 hover:bg-primary/5"
                        onClick={() => addSchedule(med.id)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Horário
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}

        <Button
          variant="outline"
          className="w-full gap-2 border-dashed text-muted-foreground hover:text-foreground"
          onClick={addMedication}
        >
          <Plus className="w-4 h-4" />
          Adicionar Medicamento
        </Button>
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Salvando..." : "Salvar Prescrição"}
      </Button>
    </div>
  )
}

function MedicationAdherenceRow({ med }: { med: PatientDashboard["medication_adherence"][number] }) {
  let badgeColor = "bg-muted text-muted-foreground border-border"
  if (med.adherence === 100) badgeColor = "bg-[#1D9E75]/15 text-[#1D9E75] border-[#1D9E75]/30"
  else if (med.adherence >= 50) badgeColor = "bg-[#EF9F27]/15 text-[#EF9F27] border-[#EF9F27]/30"
  else if (med.total_doses > 0) badgeColor = "bg-destructive/15 text-destructive border-destructive/30"

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border/50">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{med.name}</p>
        <p className="text-xs text-muted-foreground">{med.scheduled_time.slice(0, 5)}</p>
      </div>
      <Badge className={`shrink-0 ${badgeColor}`}>
        {med.total_doses > 0 ? `${med.adherence}%` : "Sem dados"}
      </Badge>
    </div>
  )
}