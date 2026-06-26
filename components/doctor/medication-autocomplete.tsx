"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

interface MedicationAutocompleteProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function MedicationAutocomplete({
    value,
    onChange,
    placeholder = "Ex: Metformina",
}: MedicationAutocompleteProps) {
    const { user, token } = useAuth()
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [loading, setLoading] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const fetchSuggestions = useCallback(
        async (q: string) => {
            if (q.length < 2) {
                setSuggestions([])
                setOpen(false)
                return
            }

            setLoading(true)
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/medications/autocomplete?q=${encodeURIComponent(q)}&doctor_id=${user?.user_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (!res.ok) return
                const data = await res.json()
                setSuggestions(data.suggestions ?? [])
                setOpen(data.suggestions?.length > 0)
                setActiveIndex(-1)
            } catch {
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        },
        [user?.user_id, token]
    )

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const q = e.target.value
        onChange(q)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => fetchSuggestions(q), 250)
    }

    function handleSelect(name: string) {
        onChange(name)
        setOpen(false)
        setSuggestions([])
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) return

        if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault()
            handleSelect(suggestions[activeIndex])
        } else if (e.key === "Escape") {
            setOpen(false)
        }
    }

    return (
        <div ref={containerRef} className="relative">
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />

            {open && (
                <ul
                    role="listbox"
                    className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-md overflow-hidden"
                >
                    {loading ? (
                        <li className="px-3 py-2 text-sm text-muted-foreground">Buscando...</li>
                    ) : (
                        suggestions.map((name, index) => (
                            <li
                                key={name}
                                role="option"
                                aria-selected={index === activeIndex}
                                onMouseDown={() => handleSelect(name)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${index === activeIndex
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted text-foreground"
                                    }`}
                            >
                                {/* Destaca a parte que bate com o que foi digitado */}
                                <HighlightMatch text={name} query={value} />
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}

// Sublinha a parte do nome que corresponde ao termo digitado
function HighlightMatch({ text, query }: { text: string; query: string }) {
    if (!query) return <>{text}</>

    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return <>{text}</>

    return (
        <>
            {text.slice(0, index)}
            <span className="font-medium text-primary">{text.slice(index, index + query.length)}</span>
            {text.slice(index + query.length)}
        </>
    )
}