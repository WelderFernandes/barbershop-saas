"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError("Email ou senha incorretos");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[600px] w-full  overflow-hidden border border-border bg-card">
      {/* Lado Esquerdo: Branding Assimétrico */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="z-10">
          <div className="mb-8 flex h-16 w-16 items-center justify-center border-2 border-primary-foreground bg-transparent">
            <span className="text-3xl font-bold">B</span>
          </div>
          <h1 className="font-heading text-6xl font-black leading-tight tracking-tighter uppercase">
            Razor <br /> Sharp <br /> Style
          </h1>
        </div>
        
        <div className="z-10 space-y-4">
          <p className="max-w-xs font-mono text-sm uppercase tracking-widest opacity-80">
            Precisão artesanal para o seu negócio.
          </p>
          <div className="h-1 w-24 bg-primary-foreground" />
        </div>

        {/* Elemento Decorativo Brutalista */}
        <div className="absolute top-0 right-0 h-full w-24 translate-x-12 rotate-12 bg-black/5" />
      </div>

      {/* Lado Direito: Formulário */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 lg:p-16">
        <div className="mb-10 lg:hidden">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tighter">BarberShop</h1>
        </div>

        <div className="mb-8 space-y-2">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">Entrar</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Acesse o painel de comando
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border-l-4 border-destructive bg-destructive/10 p-4 font-mono text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              01 // Identificador (Email)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@barber.sh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-12 border-x-0 border-t-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              02 // Chave de Acesso (Senha)
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              minLength={6}
              className="h-12 border-x-0 border-t-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-all"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="h-14 w-full font-heading text-lg font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
              disabled={loading}
            >
              {loading ? "Processando..." : "Executar Login"}
            </Button>
          </div>

          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
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
  );
}
