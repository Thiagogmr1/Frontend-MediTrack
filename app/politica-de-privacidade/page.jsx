import Link from 'next/link'
import {
    ArrowLeft,
    Shield,
    Building2,
    Database,
    Target,
    Scale,
    MessageSquare,
    Users,
    Lock,
    UserCheck,
    Cookie,
    RefreshCcw,
    AlertTriangle,
    CheckCircle2,
    XCircle,
} from 'lucide-react'

export const metadata = {
    title: 'Política de Privacidade | MediTrack',
    description:
        'Como a MediTrack Saúde Digital Ltda. coleta, usa e protege seus dados pessoais e de saúde, em conformidade com a LGPD (Lei nº 13.709/2018).',
}

// TODO: definir a data oficial de última atualização antes de publicar
const LAST_UPDATED = '7 de julho de 2026'
// TODO: definir o canal oficial de contato/encarregado (e-mail ou formulário) — obrigatório pelo art. 41 da LGPD
const CONTACT_CHANNEL = 'meditrack087@gmail.com'

const sections = [
    { id: 'quem-somos', number: '01', title: 'Quem somos', icon: Building2 },
    { id: 'dados-coletados', number: '02', title: 'Quais dados coletamos sobre você', icon: Database },
    { id: 'por-que-usamos', number: '03', title: 'Por que usamos seus dados', icon: Target },
    { id: 'base-legal', number: '04', title: 'Autorização legal para tratar seus dados', icon: Scale },
    { id: 'consentimento', number: '05', title: 'Como coletamos o seu consentimento', icon: MessageSquare },
    { id: 'quem-acessa', number: '06', title: 'Quem tem acesso aos seus dados', icon: Users },
    { id: 'protecao', number: '07', title: 'Como protegemos seus dados', icon: Lock },
    { id: 'seus-direitos', number: '08', title: 'Seus direitos como titular dos dados', icon: UserCheck },
    { id: 'cookies', number: '09', title: 'Cookies', icon: Cookie },
    { id: 'atualizacoes', number: '10', title: 'Atualizações desta Política', icon: RefreshCcw },
]

export default function PoliticaDePrivacidadePage() {
    return (
        <div className="bg-white">
            {/* Header simples de retorno */}
            <div className="border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#00695C] hover:text-[#003B46] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>

            {/* Hero da página */}
            <div className="bg-gradient-to-br from-[#003B46] to-[#00695C] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#4DB6AC] font-medium text-sm mb-6">
                        <Shield className="w-4 h-4" />
                        Conformidade LGPD
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 text-balance">
                        Política de Privacidade
                    </h1>
                    <p className="text-white/70 max-w-2xl text-pretty">
                        Como a MediTrack Saúde Digital Ltda. cuida dos seus dados pessoais e de saúde ao
                        utilizar nossa plataforma.
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-6 text-sm text-white/60">
                        <span>Versão 1.0</span>
                        <span>Última atualização: {LAST_UPDATED}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-[220px_1fr] gap-12">
                {/* Sumário */}
                <aside className="hidden lg:block">
                    <nav className="sticky top-8">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                            Nesta página
                        </p>
                        <ul className="space-y-1 border-l border-slate-200">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className="block pl-4 -ml-px border-l-2 border-transparent py-1.5 text-sm text-slate-500 hover:text-[#00695C] hover:border-[#4DB6AC] transition-colors"
                                    >
                                        {section.number}. {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Conteúdo */}
                <article className="min-w-0">
                    {/* Intro */}
                    <div className="mb-12 p-6 rounded-2xl bg-[#F0F7F6] border border-[#4DB6AC]/20">
                        <p className="text-slate-700 leading-relaxed">
                            Olá! Antes de começar, leia com atenção. Esta Política explica, de forma clara e
                            objetiva, como a MediTrack Saúde Digital Ltda. cuida dos seus dados pessoais quando
                            você utiliza nossa plataforma. Aqui você vai entender quais dados coletamos, por que
                            os usamos e como os protegemos.
                        </p>
                        <p className="text-slate-700 leading-relaxed mt-3">
                            A MediTrack foi desenvolvida para ajudar pacientes a seguirem seus tratamentos com
                            mais facilidade e segurança. Por isso, levamos a proteção das suas informações muito
                            a sério — especialmente porque lidamos com dados de saúde, que a lei considera{' '}
                            <strong className="text-[#003B46]">dados sensíveis</strong>.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* 01 - Quem somos */}
                        <Section id="quem-somos" number="01" title="Quem somos" icon={Building2}>
                            <p>
                                Somos a MediTrack Saúde Digital Ltda., responsável pela plataforma MediTrack —
                                aplicativo e sistema web voltados ao monitoramento da adesão medicamentosa e ao
                                acompanhamento do tratamento de saúde.
                            </p>
                            <p>
                                Nos termos da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), somos a{' '}
                                <strong>controladora</strong> dos seus dados pessoais: tomamos as decisões sobre
                                como e para que seus dados são utilizados.
                            </p>
                        </Section>

                        {/* 02 - Dados coletados */}
                        <Section id="dados-coletados" number="02" title="Quais dados coletamos sobre você" icon={Database}>
                            <h3 className="font-semibold text-[#003B46] mt-2 mb-3">Dados pessoais comuns</h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li>Nome completo</li>
                                <li>E-mail</li>
                                <li>Telefone (usado, entre outras coisas, para enviar notificações via WhatsApp)</li>
                                <li>Idade e sexo</li>
                                <li>Quatro dígitos do CPF, quando necessário para sua identificação na plataforma</li>
                            </ul>

                            <div className="mt-6 p-5 rounded-xl bg-amber-50 border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-amber-900 mb-1">
                                            Dados de saúde — dados sensíveis
                                        </h3>
                                        <p className="text-amber-800/90 text-sm mb-3">
                                            Esses dados são protegidos com cuidado redobrado pela LGPD e pela MediTrack.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1.5 text-amber-900/90 text-sm">
                                            <li>Medicamentos prescritos, dosagens e horários de administração</li>
                                            <li>Registro de doses tomadas ou não (calendário de adesão)</li>
                                            <li>Diagnósticos e condições de saúde informadas no contexto do seu tratamento</li>
                                            <li>Prescrições digitais, atestados, laudos e outros documentos médicos</li>
                                            <li>Conteúdo de teleconsultas e mensagens trocadas com sua equipe médica</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* 03 - Por que usamos */}
                        <Section id="por-que-usamos" number="03" title="Por que usamos seus dados" icon={Target}>
                            <p>Seus dados são usados exclusivamente para:</p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li>Criar e manter seu cadastro na plataforma</li>
                                <li>Organizar seus medicamentos e horários de tratamento</li>
                                <li>Enviar lembretes e alertas de medicação via WhatsApp</li>
                                <li>Permitir que seu médico acompanhe sua adesão ao tratamento</li>
                                <li>Guardar suas prescrições e documentos médicos de forma segura</li>
                                <li>Viabilizar teleconsultas e comunicação com sua equipe de saúde</li>
                            </ul>
                            <div className="mt-4 p-4 rounded-xl bg-[#F0F7F6] border border-[#4DB6AC]/20 text-sm text-[#003B46] font-medium">
                                Não usamos seus dados para publicidade. Não vendemos suas informações. Não
                                compartilhamos seus dados de saúde com terceiros para fins que não sejam os do seu
                                tratamento.
                            </div>
                        </Section>

                        {/* 04 - Base legal */}
                        <Section
                            id="base-legal"
                            number="04"
                            title="Por que temos autorização legal para tratar seus dados"
                            icon={Scale}
                        >
                            <p>
                                A LGPD exige que toda empresa tenha uma justificativa legal para usar seus dados.
                                No caso da MediTrack:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                <li>
                                    <strong className="text-slate-800">Dados comuns</strong> (nome, e-mail,
                                    telefone): tratados com base no seu consentimento (art. 7º, I, LGPD) e na
                                    execução do serviço que você contratou (art. 7º, V, LGPD).
                                </li>
                                <li>
                                    <strong className="text-slate-800">Dados de saúde</strong> (medicamentos,
                                    diagnósticos, histórico): tratados exclusivamente com base no seu consentimento
                                    específico (art. 11, I, LGPD), coletado no seu primeiro contato com a plataforma
                                    via WhatsApp.
                                </li>
                            </ul>
                        </Section>

                        {/* 05 - Consentimento */}
                        <Section
                            id="consentimento"
                            number="05"
                            title="Como coletamos o seu consentimento"
                            icon={MessageSquare}
                        >
                            <p>
                                Antes do primeiro alerta de medicação, você recebe uma mensagem no WhatsApp com um resumo 
                                desta Política e o link para este documento completo. Nessa mensagem, você poderá tocar em 
                                um dos botões apresentados: <strong>Aceito</strong> ou{' '}
                                <strong>Não aceito</strong>.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                <div className="p-5 rounded-xl bg-[#F0F7F6] border border-[#4DB6AC]/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-5 h-5 text-[#00695C]" />
                                        <h3 className="font-semibold text-[#003B46]">Tocar em <strong>Aceito</strong></h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Você autoriza a MediTrack a tratar seus dados pessoais e seus dados de saúde
                                        conforme descrito nesta Política, para as finalidades do seu acompanhamento
                                        terapêutico.
                                    </p>
                                </div>
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <XCircle className="w-5 h-5 text-slate-500" />
                                        <h3 className="font-semibold text-slate-700">Tocar em <strong>Não aceito</strong></h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Você não autoriza o tratamento dos seus dados. Nesse caso, não será possível
                                        utilizar as funcionalidades da plataforma MediTrack que dependem dessas
                                        informações.
                                    </p>
                                </div>
                            </div>

                            <p className="mt-6">
                                Sua resposta fica registrada como evidência do seu consentimento, conforme exigido
                                pelo art. 8º da LGPD. Caso você toque em 'Não aceito' por engano, ou queira mudar de
                                ideia depois, basta enviar a palavra ACEITAR pelo WhatsApp a qualquer momento — você
                                receberá novamente a pergunta original. Você pode revogar esse consentimento a
                                qualquer momento, conforme explicado na Seção 8.
                            </p>
                        </Section>

                        {/* 06 - Quem acessa */}
                        <Section id="quem-acessa" number="06" title="Quem tem acesso aos seus dados" icon={Users}>
                            <p>Seus dados são acessados apenas por:</p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li>Você mesmo — pelo aplicativo e pela plataforma web</li>
                                <li>Seu médico responsável — para acompanhar seu tratamento</li>
                                {/* <li>Cuidador autorizado por você — com acesso restrito ao seu calendário de adesão</li> */}
                                <li>
                                    Equipe técnica da MediTrack — somente quando necessário para o funcionamento e a
                                    segurança da plataforma, com sigilo garantido
                                </li>
                            </ul>
                        </Section>

                        {/* 07 - Proteção */}
                        <Section id="protecao" number="07" title="Como protegemos seus dados" icon={Lock}>
                            <p>Adotamos medidas técnicas e administrativas para proteger suas informações:</p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li>Criptografia dos dados sensíveis armazenados</li>
                                <li>Autenticação por senha para acesso à plataforma</li>
                                <li>Registro de logs de auditoria para rastreabilidade de acessos</li>
                                <li>Acesso restrito apenas a pessoas autorizadas</li>
                            </ul>
                            <p className="mt-4 text-sm text-slate-500">
                                Essas medidas seguem o art. 46 da LGPD, que exige que as empresas adotem
                                precauções adequadas para proteger os dados pessoais de acessos não autorizados ou
                                situações acidentais.
                            </p>
                        </Section>

                        {/* 08 - Direitos */}
                        <Section
                            id="seus-direitos"
                            number="08"
                            title="Seus direitos como titular dos dados"
                            icon={UserCheck}
                        >
                            <p>A LGPD garante a você, a qualquer momento, os seguintes direitos (art. 18, LGPD):</p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li>Saber se seus dados estão sendo tratados</li>
                                <li>Acessar os dados que temos sobre você</li>
                                <li>Corrigir dados incompletos ou incorretos</li>
                                <li>Solicitar a exclusão dos seus dados, quando aplicável</li>
                                <li>Revogar seu consentimento a qualquer momento</li>
                                <li>Ser informado sobre com quem seus dados foram compartilhados</li>
                            </ul>
                            <p>
                                Para interromper o recebimento de lembretes de medicação, entre em contato com o médico responsável 
                                pelo seu cadastro e solicite a suspensão ou o encerramento da sua prescrição — essa é a forma pela 
                                qual a interrupção é registrada no sistema. Você também pode enviar a palavra Pare ou Parar pelo 
                                WhatsApp a qualquer momento para receber essa orientação novamente. Importante: interromper os lembretes 
                                não exclui automaticamente os dados já registrados no seu histórico — a exclusão de dados pode ser 
                                solicitada separadamente, conforme abaixo.
                            </p>
                            <div className="mt-5 p-5 rounded-xl bg-[#003B46] text-white">
                                <p className="text-sm text-white/80 mb-1">
                                    Para exercer qualquer um desses direitos, entre em contato conosco pelo canal
                                    oficial da MediTrack.
                                </p>
                                <p className="font-medium text-[#4DB6AC]">Canal de contato: {CONTACT_CHANNEL}</p>
                            </div> 
                        </Section>

                        {/* 09 - Cookies */}
                        <Section id="cookies" number="09" title="Cookies" icon={Cookie}>
                            <p>
                                A plataforma web da MediTrack utiliza apenas cookies essenciais de sessão,
                                necessários para manter você autenticado(a) durante o uso. Esses cookies não
                                armazenam dados de saúde e não são utilizados para fins publicitários.
                            </p>
                            <p>
                                Para mais detalhes, consulte nossa{' '}
                                <Link href="/politica-de-cookies" className="text-[#00695C] font-medium underline underline-offset-2">
                                    Política de Cookies
                                </Link>{' '}
                                disponível na plataforma.
                            </p>
                        </Section>

                        {/* 10 - Atualizações */}
                        <Section
                            id="atualizacoes"
                            number="10"
                            title="Atualizações desta Política"
                            icon={RefreshCcw}
                        >
                            <p>
                                Esta Política pode ser atualizada para refletir melhorias na plataforma ou
                                mudanças na legislação. Sempre que isso acontecer, você será informado(a) por
                                WhatsApp ou pela própria plataforma, podendo confirmar ou revogar seu
                                consentimento novamente.
                            </p>
                        </Section>
                    </div>

                    {/* Rodapé do documento */}
                    <div className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-500 space-y-1">
                        <p>
                            Esta Política foi elaborada em conformidade com a Lei nº 13.709/2018 (Lei Geral de
                            Proteção de Dados Pessoais — LGPD).
                        </p>
                        <p>MediTrack Saúde Digital Ltda. | Anápolis, Goiás | 2026</p>
                    </div>
                </article>
            </div>
        </div>
    )
}

function Section({ id, number, title, icon: Icon, children }) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F0F7F6] text-[#00695C]">
                    <Icon className="w-4.5 h-4.5" />
                </span>
                <h2 className="text-xl font-bold text-[#003B46]">
                    <span className="text-[#4DB6AC] mr-2">{number}.</span>
                    {title}
                </h2>
            </div>
            <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed space-y-4 pl-12">
                {children}
            </div>
        </section>
    )
}