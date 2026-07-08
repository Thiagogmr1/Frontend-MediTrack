"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AccessPortal } from "@/components/access-portal"

export default function EntrarPage() {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/")
        }
    }, [loading, isAuthenticated, router])

    // Aguarda verificação do token antes de decidir o que mostrar,
    // evitando "piscar" a tela de login pra quem já está logado
    if (loading || isAuthenticated) return null

    return <AccessPortal />
}