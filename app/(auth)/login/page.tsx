"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signIn, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  EyeIcon,
  EyeOff,
  LockKeyhole,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [viewPass, setViewPass] = useState(false)

  const router = useRouter()

  const { data: session, isPending, error: sessionError } = useSession()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (isPending) {
    return <div>Loading...</div>
  }

  if (sessionError) {
    return <div>Error: {sessionError.message}</div>
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      })

      if (result.error) {
        setError("Email ou senha incorretos")
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[600px] w-full overflow-hidden rounded-md border border-border bg-card">
      {/* Lado Esquerdo: Branding Assimétrico */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="z-10">
          <div className="justify- center mb-8 flex h-20 w-20 items-center rounded-2xl border-2 border-primary-foreground bg-transparent">
            <span className="text-3xl font-bold">B.S.P</span>
          </div>
          <h1 className="font-heading text-6xl leading-tight font-black tracking-tighter uppercase">
            Barber <br /> Shop <br /> Pro
          </h1>
        </div>

        <div className="z-10 space-y-4">
          <p className="max-w-xs font-mono text-sm tracking-widest uppercase opacity-80">
            Gestão completa para o seu negócio.
          </p>
          <div className="h-1 w-24 bg-primary-foreground" />
        </div>

        {/* Elemento Decorativo Brutalista */}
        <div className="absolute top-0 right-0 h-full w-24 translate-x-12 rotate-12 bg-black/5" />
      </div>

      {/* Lado Direito: Formulário */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 lg:p-16">
        <div className="mb-10 lg:hidden">
          <h1 className="font-heading text-4xl font-bold tracking-tighter uppercase">
            BarberShop
          </h1>
        </div>

        <div className="mb-6 space-y-2">
          <h2 className="font-heading text-3xl font-bold tracking-tight uppercase">
            Entrar
          </h2>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Acesse o painel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border-l-4 border-destructive bg-destructive/10 p-4 font-mono text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
            >
              01 // Identificador (Email)
            </Label>
            <InputGroup className="h-12 border-x-0 border-t-0 border-b-2 px-0 transition-all focus-visible:border-primary focus-visible:ring-0">
              <InputGroupInput
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barber.sh"
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
              02 // Chave de Acesso (Senha)
            </Label>

            <InputGroup className="h-12 border-x-0 border-t-0 border-b-2 px-0 transition-all focus-visible:border-primary focus-visible:ring-0">
              <InputGroupInput
                id="password"
                type={viewPass ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <InputGroupAddon align="inline-start">
                <HugeiconsIcon
                  icon={LockKeyhole}
                  size={22}
                  className="text-primary"
                />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setViewPass(!viewPass)}
                >
                  {viewPass ? (
                    <HugeiconsIcon
                      icon={EyeIcon}
                      size={22}
                      className="text-primary"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={EyeOff}
                      size={22}
                      className="text-primary"
                    />
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="h-14 w-full font-heading text-lg font-black tracking-widest uppercase transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]"
              disabled={loading}
            >
              {loading ? "Processando..." : "Executar Login"}
            </Button>
          </div>

          <p className="mt-8 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            Novo operador?{" "}
            <Link
              href="/signup"
              className="font-bold text-primary hover:line-through"
            >
              Criar Credenciais
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
