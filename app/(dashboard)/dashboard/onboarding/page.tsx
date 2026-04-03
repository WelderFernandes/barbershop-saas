"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { completeOnboarding } from "@/lib/actions/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Home01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSession } from "@/lib/auth-client"
import { slugify } from "@/lib/slug"

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [isManualSlug, setIsManualSlug] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { data: session } = useSession()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await completeOnboarding({ name, slug: slugify(slug) })
      router.push("/dashboard/agenda")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar barbearia")
    } finally {
      setLoading(false)
    }
  }

  if (session && session.session?.activeOrganizationId) {
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center">
      <Card className="w-full max-w-xl rounded-md border border-primary/10 bg-background p-0 shadow-xl">
        <CardHeader className="border-b border-primary/5 bg-primary/5 p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-primary bg-background">
            <HugeiconsIcon icon={Home01Icon} className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-heading text-3xl font-black tracking-tighter uppercase">
            Configure sua <br /> Unidade
          </CardTitle>
          <CardDescription className="font-mono text-[10px] tracking-widest text-primary/70 uppercase">
            01 // Inicialização do Sistema Multi-Tenant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="border-l-4 border-destructive bg-destructive/10 p-4 font-mono text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4 overflow-auto">
              <pre>{JSON.stringify(session, null, 2)}</pre>
              <div className="space-y-2">
                <Label
                  htmlFor="org-name"
                  className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                >
                  Nome da Barbearia
                </Label>
                <Input
                  id="org-name"
                  placeholder="Ex: Barber Brutal Classic"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!isManualSlug) {
                      setSlug(slugify(e.target.value))
                    }
                  }}
                  required
                  className="h-12 rounded-2xl border border-primary/20 bg-background px-4 font-bold transition-all focus-visible:border-primary focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="org-slug"
                  className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                >
                  Identificador de URL (Slug)
                </Label>
                <div className="relative">
                  <Input
                    id="org-slug"
                    placeholder="barber-brutal"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase())
                      setIsManualSlug(true)
                    }}
                    required
                    className="h-12 rounded-2xl border border-primary/20 bg-background px-4 pl-12 font-mono text-xs transition-all focus-visible:border-primary focus-visible:ring-0"
                  />
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-xs text-primary/40 italic">
                    @/
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-dashed border-primary/20 bg-muted/20 p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="font-mono text-[10px] leading-relaxed opacity-70">
                  O sistema criará automaticamente uma organização no Better
                  Auth para esta unidade.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="font-mono text-[10px] leading-relaxed opacity-70">
                  Todos os barbeiros, serviços e agendamentos serão isolados
                  para este identificador.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="h-16 w-full rounded-3xl font-heading text-xl font-black tracking-widest uppercase shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-100"
              disabled={loading}
            >
              {loading ? "Processando Terminal..." : "Finalizar Configuração"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
