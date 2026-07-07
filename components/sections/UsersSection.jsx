'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Bell, 
  MessageCircle, 
  Smartphone, 
  Eye, 
  TrendingUp, 
  AlertCircle,
  User,
  Heart
} from 'lucide-react'

const patientFeatures = [
  { icon: Bell, title: 'Lembretes automáticos', description: 'Nunca mais esqueça um medicamento' },
  { icon: MessageCircle, title: 'Notificação no WhatsApp', description: 'Receba lembretes direto no seu WhatsApp' },
  { icon: Smartphone, title: 'Acompanhamento simples', description: 'Interface intuitiva e fácil de usar' },
]

const caregiverFeatures = [
  { icon: Eye, title: 'Acesso remoto', description: 'Acompanhe de qualquer lugar' },
  { icon: TrendingUp, title: 'Relatórios de adesão', description: 'Visualize o progresso do tratamento' },
  { icon: AlertCircle, title: 'Alertas importantes', description: 'Receba notificações prioritárias' },
]

export default function UsersSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 lg:py-32 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-block px-4 py-2 rounded-full bg-[#E0F2F1] text-[#00897B] font-medium text-sm mb-4"
          >
            Para Todos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-[#003B46] mb-4 text-balance"
          >
            Uma plataforma para pacientes e cuidadores
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[#6B7280] max-w-2xl mx-auto text-pretty"
          >
            Experiências personalizadas para cada tipo de usuário, garantindo 
            facilidade de uso e eficiência no acompanhamento do tratamento.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pacientes Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00897B] to-[#4DB6AC] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#003B46]">Para Pacientes</h3>
                <p className="text-[#6B7280]">Facilidade no dia a dia</p>
              </div>
            </div>

            <div className="space-y-6">
              {patientFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E0F2F1] group-hover:bg-[#00897B] flex items-center justify-center flex-shrink-0 transition-colors">
                    <feature.icon className="w-6 h-6 text-[#00897B] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#003B46] mb-1">{feature.title}</h4>
                    <p className="text-[#6B7280] text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Patient Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-8 bg-gradient-to-br from-[#F5F7FA] to-[#E0F2F1] rounded-2xl p-4"
            >
              <div className="max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Mensagem */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[17px] font-medium text-gray-900">
                        ⏰ Está na hora do seu remédio!
                      </p>

                      <div className="mt-6 space-y-5">
                        <p className="text-[18px] text-gray-900">
                          Losartana 50mg
                        </p>

                        <p className="text-[18px] text-gray-900">
                          Após tomar, clique em <span className="font-medium">"Tomei"</span>.
                        </p>
                      </div>
                    </div>

                    <span className="self-end text-xs text-gray-500">
                      18:57
                    </span>
                  </div>
                </div>

                {/* Botão estilo WhatsApp */}
                <button className="w-full border-t border-gray-200 py-3 flex items-center justify-center gap-2 text-[#00A884] hover:bg-gray-50 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 14 4 9l5-5" />
                    <path d="M20 17a8 8 0 0 0-8-8H4" />
                  </svg>

                  <span className="text-lg font-medium">Tomei</span>
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Cuidadores Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003B46] to-[#00695C] flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#003B46]">Para Cuidadores</h3>
                <p className="text-[#6B7280]">Cuidado à distância</p>
              </div>
            </div>

            <div className="space-y-6">
              {caregiverFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E8EDF2] group-hover:bg-[#003B46] flex items-center justify-center flex-shrink-0 transition-colors">
                    <feature.icon className="w-6 h-6 text-[#003B46] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#003B46] mb-1">{feature.title}</h4>
                    <p className="text-[#6B7280] text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Caregiver Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-8 bg-gradient-to-br from-[#003B46] to-[#00695C] rounded-2xl p-4"
            >
              <div className="text-white/80 text-sm mb-3">Acompanhando: Maria Silva</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Manhã', status: 'ok' },
                  { label: 'Tarde', status: 'ok' },
                  { label: 'Noite', status: 'pending' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-white/60 text-xs mb-1">{item.label}</p>
                    <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${
                      item.status === 'ok' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {item.status === 'ok' ? '✓' : '?'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Adesão semanal</span>
                  <span className="text-[#4DB6AC] font-bold">92%</span>
                </div>
                <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4DB6AC] rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
