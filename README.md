# MediTrack — Frontend

> Plataforma web de adesão medicamentosa com lembretes automáticos via WhatsApp.

MediTrack é um sistema voltado para médicos e pacientes que automatiza o acompanhamento da adesão ao tratamento medicamentoso. O médico cadastra pacientes e prescreve medicamentos com horários definidos; o sistema envia lembretes automáticos via WhatsApp e registra as confirmações em tempo real no dashboard.

---

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução local](#instalação-e-execução-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Deploy](#deploy)
- [Fluxo de uso](#fluxo-de-uso)
- [Repositórios relacionados](#repositórios-relacionados)

---

## Visão geral

O frontend do MediTrack é construído com **Next.js 14 (App Router)** e **TypeScript**, utilizando **Tailwind CSS** e componentes **shadcn/ui** para uma interface limpa, responsiva e acessível.

A aplicação serve dois perfis de usuário com dashboards distintos:

- **Médico** — cadastra pacientes, cria prescrições, acompanha adesão individual e geral via gráficos e calendário de histórico.
- **Paciente** — visualiza seus medicamentos, histórico de doses, adesão semanal e perfil pessoal.

---

## Funcionalidades

### Médico

- Autenticação segura com JWT (login por e-mail e senha)
- Dashboard com visão geral de adesão de todos os pacientes
- Gráfico de adesão por paciente
- Cadastro de novos pacientes
- Criação de prescrições com múltiplos medicamentos, dosagens e horários
- Tela de detalhe por paciente com:
  - Adesão geral, semanal e diária
  - Calendário de histórico de doses (últimos meses)
  - Doses tomadas, perdidas e dias consecutivos

### Paciente

- Autenticação por CPF e data de nascimento
- Painel de doses do dia com status (tomada / pendente)
- Calendário de adesão
- Lista de medicamentos ativos
- Perfil pessoal

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Next.js | 14 | Framework React com App Router |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 3 | Estilização utilitária |
| shadcn/ui | — | Componentes de interface |
| Recharts | — | Gráficos de adesão |
| react-number-format | — | Formatação de CPF e telefone |
| Sonner | — | Notificações toast |
| Lucide React | — | Ícones |

---

## Estrutura do projeto

```
frontend-meditrack/
├── app/                        # App Router (Next.js 14)
│   ├── layout.tsx              # Layout raiz
│   └── page.tsx                # Entrada da aplicação
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── doctor-dashboard.tsx    # Dashboard do médico
│   ├── doctor-overview.tsx     # Visão geral de pacientes
│   ├── doctor-patient-detail.tsx # Detalhe de paciente
│   ├── doctor-patients-list.tsx
│   ├── doctor-add-patient.tsx  # Formulário de cadastro
│   ├── doctor-new-prescription.tsx
│   ├── patient-dashboard.tsx   # Dashboard do paciente
│   ├── patient-overview.tsx
│   ├── patient-calendar.tsx
│   ├── patient-medications.tsx
│   └── patient-profile.tsx
├── lib/
│   └── auth-context.tsx        # Contexto de autenticação JWT
├── public/
│   └── logo.png
├── .env.local                  # Variáveis de ambiente (não versionado)
└── README.md
```

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend do MediTrack em execução (local ou Railway)

---

## Instalação e execução local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Frontend-MediTrack.git
cd Frontend-MediTrack

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com a URL do backend

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Em produção, substitua pelo endereço público do backend hospedado (ex: Railway).

> Nunca versione o arquivo `.env.local`. Ele já está incluído no `.gitignore`.

---

## Deploy

O frontend é hospedado na **Vercel**, com deploy automático a partir da branch `main`.

**Passos para deploy:**

1. Faça o fork ou conecte o repositório à sua conta Vercel
2. Configure a variável de ambiente `NEXT_PUBLIC_API_URL` no painel da Vercel apontando para o backend em produção
3. Todo `push` para `main` aciona um novo deploy automaticamente

---

## Fluxo de uso

```
Médico faz login
    ↓
Cadastra paciente com nome, CPF, data de nascimento e telefone WhatsApp
    ↓
Cria prescrição com medicamentos, dosagens e horários
    ↓
Sistema agenda lembretes automáticos via WhatsApp (backend)
    ↓
Paciente recebe notificação e confirma com "Tomei"
    ↓
Dashboard do médico atualiza automaticamente com a confirmação
```

---

## Repositórios relacionados

| Repositório | Descrição |
|---|---|
| [Backend-MediTrack](https://github.com/Thiagogmr1/Backend-MediTrack) | API REST em FastAPI (Python) com scheduler de lembretes e integração Twilio |