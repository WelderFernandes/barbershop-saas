"use client"

import { useState } from "react"
import Link from "next/link"
import { signUp } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Key01Icon,
  Mail01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signUp.email({
        name,
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/onboarding")
          },
          onError: (error) => {
            setError(error.error?.message || "Erro ao criar conta")
          },
        },
      })

      if (result.error) {
        setError(result.error.message || "Erro ao criar conta")
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[600px] w-full overflow-hidden rounded-md border border-border bg-card">
      {/* Lado Esquerdo: Branding Assimétrico (Consistente com Login) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="z-10">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary-foreground bg-transparent">
            <span className="text-3xl font-bold">B.S.P</span>
          </div>
          <h1 className="font-heading text-6xl leading-tight font-black tracking-tighter uppercase">
            Barber <br /> Shop <br /> Pro
          </h1>
        </div>

        <div className="z-10 space-y-4">
          <p className="max-w-xs font-mono text-sm tracking-widest uppercase opacity-80">
            Sua jornada para a gestão perfeita começa aqui.
          </p>
          <div className="h-1 w-24 bg-primary-foreground" />
        </div>

        {/* Elemento Decorativo Brutalista */}
        <div className="absolute bottom-0 left-0 h-32 w-full translate-y-16 -rotate-6 bg-black/5" />
      </div>

      {/* Lado Direito: Formulário de Cadastro */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 lg:p-16">
        <div className="mb-10 lg:hidden">
          <h1 className="font-heading text-4xl font-bold tracking-tighter text-primary uppercase">
            BarberShop Pro
          </h1>
        </div>

        <div className="mb-8 space-y-2">
          <h2 className="font-heading text-3xl font-bold tracking-tight uppercase">
            Criar Conta
          </h2>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Inicie seu registro no sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border-l-4 border-destructive bg-destructive/10 p-4 font-mono text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
            >
              01 // Nome Completo
            </Label>
            <InputGroup className="h-12 border-x-0 border-t-0 border-b-2 px-0 transition-all focus-visible:border-primary focus-visible:ring-0">
              <InputGroupInput
                id="name"
                type="text"
                placeholder="Seu Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="h-12 border-x-0 border-t-0 border-b-2 bg-transparent px-0 transition-all focus-visible:border-primary focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <HugeiconsIcon
                  icon={UserAdd01Icon}
                  size={22}
                  className="text-primary"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
            >
              02 // Endereço de Email
            </Label>
            <InputGroup className="h-12 border-x-0 border-t-0 border-b-2 px-0 transition-all focus-visible:border-primary focus-visible:ring-0">
              <InputGroupInput
                id="email"
                type="email"
                placeholder="seu@contato.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-12 border-x-0 border-t-0 border-b-2 bg-transparent px-0 transition-all focus-visible:border-primary focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={22}
                  className="text-primary"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
            >
              03 // Senha de Segurança
            </Label>
            <InputGroup className="h-12 border-x-0 border-t-0 border-b-2 px-0 transition-all focus-visible:border-primary focus-visible:ring-0">
              <InputGroupInput
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
                className="h-12 border-x-0 border-t-0 border-b-2 bg-transparent px-0 transition-all focus-visible:border-primary focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <HugeiconsIcon
                  icon={Key01Icon}
                  size={22}
                  className="text-primary"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="h-14 w-full font-heading text-lg font-black tracking-widest uppercase transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Confirmar Registro"}
            </Button>
          </div>

          <p className="mt-8 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            Já possui credenciais?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:line-through"
            >
              Realizar Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
